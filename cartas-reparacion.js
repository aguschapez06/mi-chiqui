/* Actualiza una sola vez las cinco cartitas de Mi Chiqui. */
(function () {
  "use strict";
  const migrationKey = "miChiquiLettersNatural_v1";
  if (localStorage.getItem(migrationKey) === "1") return;

  const letters = {
    "miChiquiLetters_Para cuando me extrañes": [{
      title: "Un poquito más cerca",
      content: "chiqui si me estás extrañando quiero que sepas que yo también tengo muchas ganas de verte. a veces terminamos de hablar y me quedo con ganas de seguir un ratito más con vos.\n\nme gusta pensar en todo lo lindo que compartimos y en las ganas que tengo de seguir sumando momentos juntos. aunque ahora no podamos estar abrazados quiero que sepas que te llevo conmigo durante el día.\n\nojalá pudiera aparecer un ratito para darte un abrazo bien fuerte y llenarte de besos. ya vamos a tener nuestro momento para estar juntos otra vez y seguramente no voy a querer soltarte.\n\nte extraño mucho peque. te amo."
    }],
    "miChiquiLetters_Para cuando estés feliz": [{
      title: "Me encanta verte feliz",
      content: "peque espero que estés leyendo esto porque hoy pasó algo lindo. capaz tuviste un día buenísimo o te salió algo que querías. sea lo que sea me encanta saber que estás feliz.\n\nme gusta cuando me contás las cosas que te entusiasman. quiero escucharte hablar de lo que te gusta y saber todos esos detalles que capaz para otros pasan desapercibidos. para mí también son importantes porque son parte de vos.\n\nquiero compartir tus alegrías y estar para escucharte cuando tengas algo lindo para contarme. nunca pienses que me contás demasiado porque a mí me encanta saber de vos.\n\ndisfrutá mucho este momento mi vida. ojalá tengas muchísimos motivos más para sonreír. te amo."
    }],
    "miChiquiLetters_Para cuando estés triste": [{
      title: "No tenés que estar bien siempre",
      content: "chiqui si hoy no estás bien quiero que sepas que conmigo no tenés que fingir nada. no hace falta que hagas como si no pasara nada ni que encuentres las palabras justas para explicarme qué te pasa.\n\na veces uno se siente mal y ni siquiera sabe por qué. está bien si no sabés qué decir o si no tenés ganas de hablar. podés contarme lo que quieras cuando estés lista. no voy a apurarte.\n\nme gustaría poder abrazarte y hacerte sentir un poquito mejor. quiero que sepas que no sos una molestia y que no tenés que guardarte lo que sentís para no preocuparme.\n\ny si alguna vez yo tengo algo que ver con cómo te sentís quiero que me lo digas. quiero escucharte y entenderte. me importa que podamos hablar de las cosas y aprender juntos.\n\nte amo mucho mi vida. no tenés que poder con todo hoy. vamos de a poquito."
    }],
    "miChiquiLetters_Para cualquier momento": [{
      title: "Una cartita porque sí",
      content: "hola mi chiqui. no hay ningún motivo especial para esta cartita. simplemente quería dejarte unas palabras para que las leas cuando tengas ganas.\n\na veces me pongo a pensar en lo lindo que es tenerte en mi vida. me gusta compartir mis días con vos y contarte cualquier pavada. también me gusta escucharte y conocer cada vez un poquito más de vos.\n\nno somos perfectos y todavía tenemos cosas que aprender. yo también tengo cosas para mejorar y quiero hacerlo. quiero que lo nuestro se note en cómo nos tratamos y en cómo nos cuidamos todos los días.\n\nquiero seguir conociéndote y seguir compartiendo un montón de cosas con vos. quiero que tengamos muchas primeras veces y también repetir esas pequeñas cosas que nos hacen felices.\n\npor si alguna vez te olvidás quiero recordarte que te amo muchísimo y que me hace muy feliz estar con vos mi vida."
    }],
    "miChiquiLetters_Para cuando necesites un abrazo": [{
      title: "Vení que te abrazo",
      content: "mi vida imaginá por un ratito que estoy con vos y te doy uno de esos abrazos en los que no hace falta decir nada.\n\nno tenés que contarme qué pasó si todavía no querés. tampoco tenés que encontrar una solución ahora mismo. a veces alcanza con sentirse acompañada y saber que alguien está ahí.\n\nme gustaría abrazarte fuerte y quedarme así un rato. si tenés ganas de hablar te voy a escuchar y si preferís estar tranquila también está bien.\n\nconmigo no tenés que demostrar que sos fuerte todo el tiempo. podés estar cansada o tener un día feo. también podés necesitar cariño y pedirme todos los abrazos que quieras.\n\nno siempre voy a saber qué decir pero quiero aprender a acompañarte como vos necesitás. te mando el abrazo más grande peque. te amo muchísimo."
    }]
  };

  Object.keys(letters).forEach(function (key) {
    localStorage.setItem(key, JSON.stringify(letters[key]));
  });
  localStorage.setItem(migrationKey, "1");
})();
