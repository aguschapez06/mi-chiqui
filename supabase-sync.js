/* Mi Chiqui · invitacion privada por enlace */
(function () {
  const SUPABASE_URL = "https://efhpksvvciikgemmdphs.supabase.co";
  const SUPABASE_KEY = "sb_publishable_EiYPHhXJR-0oCCnnS60u4w_8yA1vx4x";
  const SPACE_KEY = "miChiquiSpaceId";
  let client;

  function addStyles() {
    if (document.getElementById("mc-cloud-styles")) return;
    const style = document.createElement("style");
    style.id = "mc-cloud-styles";
    style.textContent = `
      #mc-cloud-gate{position:fixed;inset:0;z-index:99999;background:#f9eef2;display:flex;align-items:center;justify-content:center;padding:22px;box-sizing:border-box;font-family:Montserrat,Arial,sans-serif;color:#684354}
      #mc-cloud-card{width:min(100%,410px);background:#fffafc;border:1px solid #ebcad8;border-radius:24px;padding:28px 22px;box-sizing:border-box;text-align:center;box-shadow:0 12px 38px #a45d7820}
      #mc-cloud-card h1{font-family:'Cormorant Garamond',Georgia,serif;font-size:34px;font-weight:500;margin:0 0 8px}
      #mc-cloud-card p{font-size:13px;line-height:1.6;margin:8px 0 18px}
      #mc-cloud-card button{width:100%;border:0;border-radius:15px;background:#c77f9d;color:white;padding:14px 12px;font:500 14px Montserrat,Arial;cursor:pointer;margin-top:10px}
      #mc-cloud-card button.mc-secondary{background:#f2dce5;color:#78475c}
      #mc-cloud-status{font-size:12px;min-height:20px;margin-top:12px;color:#9b5573}
      #mc-cloud-gate[hidden]{display:none}
      #mc-cloud-share{position:static;display:block;width:auto;margin:12px auto 0;border:0;border-radius:999px;background:#c77f9d;color:#fff;padding:11px 17px;box-shadow:0 5px 18px #68435420;font:500 12px Montserrat,Arial;cursor:pointer}
    `;
    document.head.appendChild(style);
  }

  function makeGate() {
    addStyles();
    let gate = document.getElementById("mc-cloud-gate");
    if (gate) return gate;
    gate = document.createElement("div");
    gate.id = "mc-cloud-gate";
    gate.innerHTML = '<div id="mc-cloud-card"><h1>Nuestro espacio</h1><div id="mc-cloud-actions"><button id="mc-cloud-create">Crear un espacio</button><button id="mc-cloud-join" class="mc-secondary">Entrar con invitación</button></div><div id="mc-cloud-status"></div></div>';
    document.body.appendChild(gate);
    return gate;
  }

  function status(message) {
    const el = document.getElementById("mc-cloud-status");
    if (el) el.textContent = message;
  }

  function enterSpace(spaceId) {
    localStorage.setItem(SPACE_KEY, spaceId);
    window.miChiquiSupabase = client;
    window.miChiquiSpaceId = spaceId;
    const gate = document.getElementById("mc-cloud-gate");
    if (gate) gate.hidden = true;
    document.dispatchEvent(new CustomEvent("miChiquiCloudReady"));
  }

  function addShareButton(code) {
    if (!code) return;
    const inviteUrl = new URL(window.location.href);
    inviteUrl.searchParams.set("invite", code);
    inviteUrl.hash = "";
    window.miChiquiInviteUrl = inviteUrl.toString();
    if (document.getElementById("mc-cloud-share")) return;
    const button = document.createElement("button");
    button.id = "mc-cloud-share";
    button.type = "button";
    button.textContent = "Copiar invitación";
    button.addEventListener("click", async function () {
      try {
        await navigator.clipboard.writeText(window.miChiquiInviteUrl);
      } catch (error) {
        window.prompt("Copiá este enlace para Chiqui:", window.miChiquiInviteUrl);
      }
      button.remove();
    });
    const nextButton = document.getElementById("nextButton");
    if (nextButton && nextButton.parentNode) nextButton.insertAdjacentElement("afterend", button);
    else document.body.appendChild(button);
  }

  async function loadInviteButton() {
    const result = await client.rpc("get_my_space_invite_code");
    if (result.error) {
      console.error("Mi Chiqui invitacion:", result.error);
      return;
    }
    addShareButton(result.data);
  }

  async function start() {
    makeGate();
    try {
      if (!window.supabase || !window.supabase.createClient) throw new Error("No se pudo cargar el servicio de conexion. Revisa tu conexion a internet.");
      client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      let sessionResult = await client.auth.getSession();
      if (sessionResult.error) throw sessionResult.error;
      if (!sessionResult.data.session) {
        status("Preparando tu acceso...");
        const authResult = await client.auth.signInAnonymously();
        if (authResult.error) throw authResult.error;
      }

      let savedSpace = localStorage.getItem(SPACE_KEY);
      const current = await client.auth.getUser();
      if (current.error || !current.data.user) throw current.error || new Error("No encontramos tu usuario.");

      if (!savedSpace) {
        status("Buscando nuestro espacio...");
        const membership = await client.from("couple_members").select("space_id").eq("user_id", current.data.user.id).maybeSingle();
        if (membership.error) throw membership.error;
        if (membership.data) {
          savedSpace = membership.data.space_id;
          localStorage.setItem(SPACE_KEY, savedSpace);
        }
      }

      if (savedSpace) {
        enterSpace(savedSpace);
        loadInviteButton();
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const inviteCode = (params.get("invite") || "").trim().toUpperCase();
      if (inviteCode) {
        status("Aceptando la invitación...");
        const joined = await client.rpc("join_space_with_code", { p_invite_code: inviteCode });
        if (joined.error) throw joined.error;
        if (!joined.data) throw new Error("No pudimos confirmar la invitación.");
        params.delete("invite");
        const cleanUrl = window.location.pathname + (params.toString() ? "?" + params.toString() : "") + window.location.hash;
        window.history.replaceState({}, "", cleanUrl);
        enterSpace(joined.data);
        return;
      }

      status("Para entrar, abrí el enlace de invitación que te compartieron.");
      document.getElementById("mc-cloud-actions").innerHTML = '<p>Necesitás abrir el enlace privado de invitación para entrar a nuestro espacio.</p>';
    } catch (error) {
      console.error("Mi Chiqui conexion:", error);
      status(error.message || "No pudimos conectar. Actualiza la pagina e intenta de nuevo.");
    }
  }

  async function createSpace() {
    status("Creando nuestro espacio...");
    const result = await client.rpc("create_my_space");
    if (result.error) { status(result.error.message || "No se pudo crear el espacio."); return; }
    const row = Array.isArray(result.data) ? result.data[0] : result.data;
    if (!row || !row.space_id || !row.invite_code) { status("El espacio se creo, pero no pudimos preparar la invitación."); return; }
    enterSpace(row.space_id);
    addShareButton(row.invite_code);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
