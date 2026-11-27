/* Restaura caracteres dañados en las cartitas originales sin tocar cartas personalizadas. */
(function () {
  "use strict";
  const originals = {
  "miChiquiLetters_Para cuando me extrañes": [
    {
      "title": "Un poquito más cerca",
      "content": "chiqui, si me estás extrañando quiero que sepas que yo también tengo muchísimas ganas de verte. hay veces en las que terminamos una llamada y me quedo pensando en lo lindo que sería que no tuviéramos que despedirnos todavía.\nme acuerdo bastante de nuestro primer día en Montevideo Shopping. yo había llegado temprano y cuando nos vimos me dijiste que estabas muy nerviosa. hasta te costaba comer. me acuerdo de nuestra mesa en el patio de comidas y de esas excusas que buscábamos para agarrarnos de la mano cuando pasábamos entre la gente.\ntambién me acuerdo de cuando me dijiste que rico olor tenés. capaz fue un comentario chiquito para vos pero yo me lo guardé jajajaja. y ni hablar de nuestro primer piquito después de comer y caminar juntos.\nson recuerdos que me gusta volver a pensar cuando tengo ganas de estar con vos. también están Esponjita y Mora que de alguna manera me hacen acordar a esos comienzos nuestros.\nojalá pudiera aparecer ahora y darte uno de esos abrazos que hacen que no quiera soltarte enseguida. mientras tanto quiero que sepas que aunque hoy no estemos en el mismo lugar sigo teniendo las mismas ganas de compartir cosas con vos.\nya vamos a volver a vernos. y seguramente cuando llegue ese momento voy a querer aprovechar cada ratito.\nte extraño y te amo mucho mi vida."
    }
  ],
  "miChiquiLetters_Para cuando estés feliz": [
    {
      "title": "Me encanta verte feliz",
      "content": "mi chiqui preciosa, espero que estés leyendo esto porque hoy pasó algo lindo. capaz tuviste un día buenísimo, te salió algo que querías o simplemente estás contenta sin saber muy bien por qué jajajaja.\nquería escribirte una cartita para esos momentos porque muchas veces pensamos en escribir cuando algo está mal y nos olvidamos de guardar también las cosas lindas.\nme gusta saber que estás feliz. me gusta cuando me contás algo que te entusiasma y cuando compartís conmigo esas pequeñas cosas que capaz para otra persona no significan demasiado pero para vos sí. quiero conocer todo eso. quiero saber qué te gusta, qué te emociona, qué cosas te dan ganas de levantarte y hacer algo.\ntambién quiero formar parte de esos momentos. no solamente de los días en los que necesitás que te acompañen sino también de esos en los que tenés ganas de contarle a alguien algo buenísimo y compartir la emoción.\nojalá pudiera verte ahora y darte un beso mientras me contás todo. seguramente terminaría haciéndote preguntas sobre cada detalle jajajaja.\ndisfrutá mucho de lo que te está haciendo feliz. no minimices tus logros ni tus alegrías. me encanta que tengas motivos para sonreír y quiero seguir conociendo cada una de esas cosas.\nte amo mi vida. disfrutá mucho este momento."
    }
  ],
  "miChiquiLetters_Para cuando estés triste": [
    {
      "title": "No tenés que estar bien siempre",
      "content": "chiqui, si estás leyendo esto capaz hoy no estás teniendo un día muy lindo. y antes de decirte cualquier otra cosa quiero que sepas que no tenés que fingir estar bien conmigo. no tenés que hacer como si no pasara nada ni buscar una explicación perfecta para contarme qué te pasa.\na veces uno ni siquiera sabe qué tiene. simplemente se siente mal y no encuentra la manera de explicarlo. y está bien. no necesito que tengas todas las palabras ni que me cuentes todo de una vez. podés hablarme cuando quieras y también podés quedarte calladita si eso es lo que necesitás.\nme gustaría poder estar ahí para abrazarte y escucharte. pero si no puedo hacerlo en ese momento quiero que recuerdes que sigo estando. no sos una molestia por contarme tus problemas ni tenés que guardarte las cosas para no preocuparme.\nquiero conocer también esos días tuyos que no son tan lindos. quiero que puedas confiar en mí y sentir que no tenés que resolver absolutamente todo sola.\ny si alguna vez algo que hice yo tiene que ver con cómo te sentís quiero que me lo digas. prefiero escucharte y aprender a hacer las cosas mejor antes que dejar que te guardes algo que te lastima.\nte amo muchísimo mi vida. no hace falta que hoy puedas con todo. vamos de a poquito."
    }
  ],
  "miChiquiLetters_Para cualquier momento": [
    {
      "title": "Una cartita porque sí",
      "content": "hola mi chiqui, bueno, no hay un motivo especial para que estés leyendo esto. no es tu cumpleaños ni nuestro aniversario ni pasó algo puntual. simplemente quería dejarte unas palabras para que puedas abrirlas cualquier día.\na veces me pongo a pensar en nosotros y en todo lo que fuimos viviendo desde aquel 13 de enero. quién diría que aquel día en Montevideo Shopping iba a terminar convirtiéndose en una fecha tan importante para mí. después llegó el 17 de febrero y empezamos oficialmente esta relación que tanto quiero.\nme gusta que tengamos recuerdos que son solamente nuestros. nuestra mesa, Esponjita, Mora, las llamadas, las conversaciones y todas esas pequeñas cosas que quizás no parecen enormes cuando pasan pero que después terminan significando un montón.\nsé que no somos perfectos. tuvimos momentos complicados y todavía tenemos cosas que aprender. yo también tengo muchas cosas que mejorar y quiero hacerlo. no quiero que nuestro amor se quede solamente en lo que decimos. quiero que se note en cómo nos tratamos y en cómo nos cuidamos.\nme gusta compartir mi vida con vos. contarte mis cosas, escuchar tus opiniones, pedirte consejos y saber qué pensás. me gusta que formes parte de mis días incluso cuando no estamos haciendo nada especial.\nquiero seguir conociéndote. seguir teniendo primeras veces con vos y también repetir un montón de momentos que ya vivimos. quiero que sigamos haciendo planes y construyendo nuestros recuerdos de a poquito.\nno sé cuántas veces vas a volver a abrir esta cartita pero ojalá cada vez te recuerde que hay alguien que te ama muchísimo y que está muy feliz de compartir esta historia con vos.\nte amo mucho mi vida."
    }
  ],
  "miChiquiLetters_Para cuando necesites un abrazo": [
    {
      "title": "Vení que te abrazo",
      "content": "mi vida, imaginá por un ratito que estoy ahí con vos. que me acerco y te doy un abrazo de esos en los que no hace falta decir nada enseguida.\nno tenés que contarme qué pasó si todavía no querés. tampoco tenés que encontrar una solución en este mismo momento. a veces simplemente necesitamos parar un poco y sentir que alguien nos acompaña.\nme gustaría poder abrazarte ahora y quedarme así un rato. preguntarte si necesitás algo y escucharte si tenés ganas de hablar. y si lo único que querés es estar tranquila tampoco habría ningún problema.\nquiero que sepas que conmigo no tenés que demostrar que sos fuerte todo el tiempo. podés tener días en los que estés cansada y no tengas ganas de hacer nada. podés necesitar amor y podés pedírmelo.\nsé que no siempre voy a saber exactamente qué decir o cómo ayudarte. pero quiero aprender a acompañarte de la manera que vos necesitás. quiero escucharte sin apurarte y entenderte sin hacerte sentir que lo que te pasa es una tontería.\nasí que por ahora te mando un abrazo enorme mi chiquita preciosa. ojalá pudiera darte un beso en la frente y quedarme un ratito más con vos.\nte amo muchísimo."
    }
  ]
};
  function normalize(value) {
    return String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  function distance(a, b) {
    const x = normalize(a), y = normalize(b);
    const row = Array.from({length:y.length + 1}, (_, i) => i);
    for (let i = 1; i <= x.length; i++) {
      let prev = row[0]; row[0] = i;
      for (let j = 1; j <= y.length; j++) {
        const old = row[j];
        row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (x[i - 1] === y[j - 1] ? 0 : 1));
        prev = old;
      }
    }
    return row[y.length];
  }
  Object.keys(originals).forEach(function (key) {
    try {
      const saved = JSON.parse(localStorage.getItem(key) || "[]");
      let changed = false;
      saved.forEach(function (entry) {
        const title = String(entry.title || "");
        const content = String(entry.content || "");
        if (!title.includes("\uFFFD") && !content.includes("\uFFFD")) return;
        let best = null, bestDistance = Infinity;
        originals[key].forEach(function (original) {
          const d = distance(title, original.title);
          if (d < bestDistance) { best = original; bestDistance = d; }
        });
        const damagedCount = (title.match(/\uFFFD/g) || []).length;
        if (best && bestDistance <= Math.max(2, damagedCount + 1)) {
          entry.title = best.title;
          entry.content = best.content;
          changed = true;
        }
      });
      if (changed) localStorage.setItem(key, JSON.stringify(saved));
    } catch (error) {
      console.error("No se pudieron reparar las cartitas:", key, error);
    }
  });
})();