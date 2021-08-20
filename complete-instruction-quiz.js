if (location.hostname == "moodle.mosbach.dhbw.de") {

  var win = window.open("https://moodle.mosbach.dhbw.de/")
  var frame

  var state = 0

  win.onload = () => {
    win.document.body.innerHTML = '<iframe id="frame" src="https://moodle.mosbach.dhbw.de/mod/lesson/view.php?id=146432&pageid=11267&startlastseen=no" frameborder="0" style="width: 100vw; height: 100vh; display: block"></iframe>'
    frame = win.document.getElementById("frame")
    frame.onload = () => {
      if (state == 0) {
        if (!submitNext()) {
          state++
          frame.src = "https://moodle.mosbach.dhbw.de/mod/lesson/view.php?id=85862&pageid=9093&startlastseen=no"
        }
      } else if (state == 1) {
        if (!submitNext()) {
          const answer = getAnswer()
          console.log("answer: " + answer)
          if (answer) {
            getElementOfAnswer(answer).checked = true
            getSubmitAnswerForm().submit()
          } else {
            getContinueForm().submit()
          }
        }
      }

    }
  }

  function submitNext() {
    var branchButtonContainers = frame.contentDocument.getElementsByClassName("branchbuttoncontainer")

    if (branchButtonContainers.length) {
      branchButtonContainers[0].getElementsByTagName("form")[0].submit()
      return true
    } else {
      return false
    }
  }

  function getAnswer() {
    const questionContainer = frame.contentDocument.getElementsByClassName("contents")[0]
    if (!questionContainer) return null
    return answers[questionContainer.innerText.trim().replace(/\n/g, '')]
  }

  function getElementOfAnswer(correctAnswers) {
    console.log("getElementOf " + correctAnswers)
    const answeroptions = frame.contentDocument.getElementsByClassName("form-check-label")
    for (let ans of answeroptions) {
      const index = correctAnswers.indexOf(ans.innerText.trim().replace(/\n/g, ''))
      console.log(index)
      if (index >= 0) return ans.getElementsByTagName("input")[0]
    }
    return null
  }

  function getSubmitAnswerForm() {
    return frame.contentDocument.querySelectorAll("form[action='https://moodle.mosbach.dhbw.de/mod/lesson/continue.php']")[0]
  }

  function getContinueForm() {
    return frame.contentDocument.querySelectorAll("form[action='https://moodle.mosbach.dhbw.de/mod/lesson/view.php']")[0]
  }

  const answers = {
    "Dürfen private Kaffeemaschinen in den Unterrichtsräumen betrieben werden?": ["Nein."],
    "In welchen Räumen ist den Studierenden der Verzehr von Speisen und Getränken gestattet? In ...": ["Studentenaufenthaltsräumen, Cafeteria bzw. Räumen, in denen Getränkeautomaten aufgestellt sind"],
    "Welche der beiden folgenden Aussagen ist richtig?": ["Alle Einrichtungsgegenstände und Räumlichkeiten der DHBW Mosbach sind pfleglich zu behandeln. Beschädigungen oder Funktionsstörungen (z.B. bei Getränkeautomaten, Kopierern) sind umgehend den Hausmeistern, einem der Sekretariate oder dem Laborpersonal zu melden."],
    "Welches Mobiliar darf in den Außenbereichen der DHBW Mosbach verwendet werden?": ["Stühle und Tische aus der Cafeteria."],
    "Im Außenbereich darf nur das für diesen Zweck beschaffte Mobiliar verwendet werden. Muss dies nach Gebrauch wieder an den dafür vorgesehenen Platz zurückgebracht und ggf. gereinigt werden?": ["Ja."],
    "Müssen beim Verlassen der Räume und bei Raumwechsel die Fenster geschlossen werden?": ["Ja."],
    "Welche Aussage ist richtig?": [
      "Das Mitführen von Haustieren jeglicher Art (Ausnahme: Blindenführhunde) ist in den Gebäuden der DHBW Mosbach untersagt.",
      "An der DHBW Mosbach wird der Müll getrennt. Entsorgen Sie Müll immer in den vorgesehenen Behältern.",
      "Betriebsräume dürfen nicht betreten werden."
    ],
  }

} else {
  console.log("Gehe zuerst auf https://moodle.mosbach.dhbw.de/ und melde dich an.")
}
