$(document).ready(function () {
  const audioContainer = $(".records #audio");

  let stream = null;
  let recorder = null;

  async function startRecorder() {
    audioContainer.hide().html("");

    try {
      // Acessa o microfone
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Inicializa o gravador de mídia
      recorder = new MediaRecorder(stream);

      recorder.ondataavailable = function (event) {
        if (recorder.state == "inactive") {
          const blob = new Blob([event.data], { type: "audio/webm" });

          const sourceTag = $("<source />")
            .attr("src", URL.createObjectURL(blob))
            .attr("type", "audio/webm");

          const audioTag = $("<audio />")
            .attr("controls", "controls")
            .append(sourceTag);

          audioContainer.append(audioTag).show();
        }
      };

      recorder.start();
    } catch (err) {
      stopRecorder();
      console.error(err);
      alert("sem acesso ao microfone :(");
    }
  }

  function stopRecorder() {
    recorder.stop();
    stream.getTracks().forEach(function (track) {
      if (track.readyState == "live" && track.kind === "audio") {
        track.stop();
      }
    });
  }

  $(".rec-button").click(async function (event) {
    const el = $(event.currentTarget);

    // Inicia a gravação
    if (!el.hasClass("active")) {
      el.addClass("active");
      startRecorder();
    }
    // Interrompe a gravação
    else {
      el.removeClass("active");
      stopRecorder();
    }
  });
});
