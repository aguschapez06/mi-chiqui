/* Mi Chiqui · conexion privada */
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
      #mc-cloud-card .mc-heart{font-size:34px;color:#c77f9d;margin-bottom:8px}
      #mc-cloud-card h1{font-family:'Cormorant Garamond',Georgia,serif;font-size:34px;font-weight:500;margin:0 0 8px}
      #mc-cloud-card p{font-size:13px;line-height:1.6;margin:8px 0 18px}
      #mc-cloud-card button{width:100%;border:0;border-radius:15px;background:#c77f9d;color:white;padding:14px 12px;font:500 14px Montserrat,Arial;cursor:pointer;margin-top:10px}
      #mc-cloud-card button.mc-secondary{background:#f2dce5;color:#78475c}
      #mc-cloud-card input{width:100%;box-sizing:border-box;border:1px solid #e4c3d1;border-radius:13px;padding:13px;margin:7px 0;font:14px Montserrat,Arial;background:white;color:#684354}
      #mc-cloud-status{font-size:12px;min-height:20px;margin-top:12px;color:#9b5573}
      #mc-cloud-gate[hidden]{display:none}
    `;
    document.head.appendChild(style);
  }

  function makeGate() {
    addStyles();
    let gate = document.getElementById("mc-cloud-gate");
    if (gate) return gate;
    gate = document.createElement("div");
    gate.id = "mc-cloud-gate";
    gate.innerHTML = '<div id="mc-cloud-card"><div class="mc-heart">Mi Chiqui</div><h1>Mi Chiqui</h1><p>Un espacio privado para compartir nuestros recuerdos, cartitas y momentos.</p><div id="mc-cloud-actions"><button id="mc-cloud-create">Crear nuestro espacio</button><button id="mc-cloud-join" class="mc-secondary">Ya tengo un codigo</button></div><div id="mc-cloud-status">Conectando de forma segura...</div></div>';
    document.body.appendChild(gate);
    return gate;
  }

  function status(message) {
    const el = document.getElementById("mc-cloud-status");
    if (el) el.textContent = message;
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
      if (savedSpace) {
        status("Verificando nuestro espacio...");
        const check = await client.from("couple_members").select("space_id").eq("space_id", savedSpace).eq("user_id", current.data.user.id).maybeSingle();
        if (check.error) throw check.error;
        if (!check.data) savedSpace = null;
      }
      if (!savedSpace) {
        status("Buscando el espacio que ya habias creado...");
        const membership = await client.from("couple_members").select("space_id").eq("user_id", current.data.user.id).maybeSingle();
        if (membership.error) throw membership.error;
        if (membership.data) {
          savedSpace = membership.data.space_id;
          localStorage.setItem(SPACE_KEY, savedSpace);
        }
      }
      if (savedSpace) {
        status("Recuperando el codigo de nuestro espacio...");
        const spaceInfo = await client.from("couple_spaces").select("invite_code").eq("id", savedSpace).maybeSingle();
        if (spaceInfo.error) throw spaceInfo.error;
        if (spaceInfo.data && spaceInfo.data.invite_code) {
          const actions = document.getElementById("mc-cloud-actions");
          actions.innerHTML = '<p>Este es el codigo para vincular el otro celular:</p><input id="mc-cloud-code" readonly><button id="mc-cloud-copy">Copiar codigo</button><button id="mc-cloud-continue">Continuar</button>';
          document.getElementById("mc-cloud-code").value = spaceInfo.data.invite_code;
          document.getElementById("mc-cloud-copy").addEventListener("click", async () => {
            const codeInput = document.getElementById("mc-cloud-code");
            codeInput.select();
            try { await navigator.clipboard.writeText(codeInput.value); status("Codigo copiado. Ya podes compartirlo con Chiqui."); }
            catch (_) { status("Selecciona el codigo y copialo manualmente."); }
          });
          document.getElementById("mc-cloud-continue").addEventListener("click", () => {
            document.getElementById("mc-cloud-gate").hidden = true;
            window.miChiquiSupabase = client;
            window.miChiquiSpaceId = savedSpace;
            document.dispatchEvent(new CustomEvent("miChiquiCloudReady"));
          });
          status("Encontramos tu espacio. Guarda y comparti este codigo con Chiqui.");
          return;
        }
        throw new Error("Encontramos tu espacio, pero no pudimos leer el codigo. No crees otro espacio; avisame.");
      }
      status("Elegi como queres conectar este celular.");
      document.getElementById("mc-cloud-create").addEventListener("click", createSpace);
      document.getElementById("mc-cloud-join").addEventListener("click", showJoin);
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
    if (!row || !row.space_id || !row.invite_code) { status("El espacio se creo, pero no pudimos leer el codigo. Avisame."); return; }
    localStorage.setItem(SPACE_KEY, row.space_id);
    const actions = document.getElementById("mc-cloud-actions");
    actions.innerHTML = '<p>Nuestro espacio esta creado!</p><p>Este es el codigo para vincular el otro celular:</p><input id="mc-cloud-code" readonly><button id="mc-cloud-continue">Continuar</button>';
    document.getElementById("mc-cloud-code").value = row.invite_code;
    document.getElementById("mc-cloud-continue").addEventListener("click", () => {
      document.getElementById("mc-cloud-gate").hidden = true;
      window.miChiquiSupabase = client;
      window.miChiquiSpaceId = row.space_id;
      document.dispatchEvent(new CustomEvent("miChiquiCloudReady"));
    });
    status("Guarda este codigo y compartilo con Chiqui. Se ingresa una sola vez.");
  }

  function showJoin() {
    const actions = document.getElementById("mc-cloud-actions");
    actions.innerHTML = '<input id="mc-cloud-invite" maxlength="8" autocomplete="off" placeholder="Codigo de 8 caracteres"><button id="mc-cloud-submit">Vincular este celular</button><button id="mc-cloud-back" class="mc-secondary">Volver</button>';
    document.getElementById("mc-cloud-submit").addEventListener("click", joinSpace);
    document.getElementById("mc-cloud-back").addEventListener("click", () => location.reload());
    status("Ingresa el codigo que te compartieron.");
  }

  async function joinSpace() {
    const input = document.getElementById("mc-cloud-invite");
    const code = (input.value || "").trim().toUpperCase();
    if (code.length !== 8) { status("El codigo tiene que tener 8 caracteres."); return; }
    status("Vinculando este celular...");
    const result = await client.rpc("join_space_with_code", { p_invite_code: code });
    if (result.error) { status(result.error.message || "No se pudo vincular. Revisa el codigo."); return; }
    const spaceId = result.data;
    if (!spaceId) { status("No pudimos confirmar el espacio."); return; }
    localStorage.setItem(SPACE_KEY, spaceId);
    window.miChiquiSupabase = client;
    window.miChiquiSpaceId = spaceId;
    document.getElementById("mc-cloud-gate").hidden = true;
    document.dispatchEvent(new CustomEvent("miChiquiCloudReady"));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
