if (location.hostname == "moodle.mosbach.dhbw.de") {

  var win = window.open("https://moodle.mosbach.dhbw.de/")
  var frame

  win.onload = () => {
    win.document.body.innerHTML = '<iframe id="frame" src="https://moodle.mosbach.dhbw.de/mod/lesson/view.php?id=146432&pageid=11267&startlastseen=no" frameborder="0" style="width: 100vw; height: 100vh; display: block"></iframe>'
    frame = win.document.getElementById("frame")
    frame.onload = () => {
      if (!submitNext()) {
        frame.onload = () => {
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
        frame.src = "https://moodle.mosbach.dhbw.de/mod/lesson/view.php?id=85862&pageid=9093&startlastseen=no"
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
      "Betriebsräume dürfen nicht betreten werden.",
      "Aushänge sind von allen Mitarbeitern und Studierenden zu beachten. Dies gilt jederzeit und jeder hat sich eigenständig über die neuesten Aushänge zu informieren.",
      "Das Mitführen von Waffen, Munition und explosionsgefährlichen Stoffen ist auf dem gesamten Campus untersagt. Als Waffen gelten insbesondere alle Schusswaffen, Stoßwaffen sowie Spring-, Fall-, Faust- und Butterflymesser.",
      "Der Handel mit Drogen und Betäubungsmittel ist an der DHBW Mosbach verboten.",
      "Der Alkoholkonsum ist auf dem gesamten Gelände der DHBW Mosbach verboten, soweit keine Ausnahmen ausdrücklich vom Rektorat genehmigt sind.",
      "Das Verteilen von Flugblättern, Prospekten und Handzetteln bedarf der vorherigen Zustimmung der Verwaltungsleitung.",
      "Das Durchführen von Befragungen bedarf der vorherigen Zustimmung der Verwaltungsleitung.",
      "Das Durchführen von Veranstaltungen, Live-Musik usw. ist durch die Verwaltungsleitung zu genehmigen.",
      "Das Abstellen und Benutzen von Inline-Skates, Kickboards oder Fahrrädern in den Gebäuden der DHBW Mosbach ist nicht gestattet.",
      "Das Entzünden von Feuer ist strengstens untersagt.",
      
    ],
    "„Mit dem Betreten der Gebäude der DHBW wird die Haftung für unbeaufsichtigte Gegenstände (z.B. Laptops, Kleidungsstücke, Taschen) von der DHBW Mosbach abgedeckt.“ Ist diese Aussage richtig?": ["Nein."],
    "„Das Anbringen von Plakaten und Aushängen im Bereich der DHBW Mosbach bedarf der Genehmigung.“ Ist diese Aussage richtig?": ["Ja. Es ist nicht erlaubt, in der DHBW Mosbach beliebig Plakate aufzuhängen. Dazu stehen den Studierenden Pin-Wände zur Verfügung."],
    "Welche Aussage ist zum Thema „Rauchen“ richtig?": ["Gemäß Landesnichtraucherschutzgesetz (LNRSchG) ist in allen Gebäuden der DHBW Mosbach das Rauchen gesetzlich untersagt. Im Außenbereich ist das Rauchen nur an gesondert ausgewiesenen Plätzen gestattet. An diesen Stellen befinden sich auch Aschenbecher. Im direkten Außenbereich der Haupteingänge der Gebäude ist das Rauchen nicht erlaubt."],
    "Welche Aussage ist zum Thema „Feiern auf dem Campus“ richtig?": ["Feiern jeglicher Art (Grillfeste, Abschlussfeiern usw.) sind grundsätzlich nicht zulässig. In begründeten Einzelfällen können derartige Veranstaltungen nach vorheriger Genehmigung und unter bestimmten Voraussetzungen durch die Verwaltungsleitung durchgeführt werden."],
    "Welche Aussage ist zum Thema „Parken“ richtig?": [
      "Parkplätze dürfen nur während der Vorlesungs- und Klausurzeit sowie während eines Bibliotheksbesuchs genutzt werden.",
      "Die Parkregelungen in der Haus- und Laborordnung sind zu beachten. Die Straßenverkehrsordnung gilt auf dem Gelände der DHBW Mosbach."
    ],
    
  }

} else {
  console.log("Gehe zuerst auf https://moodle.mosbach.dhbw.de/ und melde dich an.")
}
