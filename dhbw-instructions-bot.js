// Getestet am 21.08.2021 unter Win10, Chrome. Funktioniert nicht unter Firefox.
// Das Skript ist kein Ersatz für die Unterweisung. Informiere dich über die Vorgaben der DHBW. Alle Fragen und Antworten werden in der Konsole ausgegeben.
// 1. Gehe auf https://moodle.mosbach.dhbw.de/ und melde dich an.
// 2. Öffne die Entwicklertools (F12), klicke auf den Tab Konsole und gebe das ganze Skript dort rein. Es dauert ein paar Minuten bis das Skript durchgelaufen ist.

if (location.hostname == "moodle.mosbach.dhbw.de") {

  let nextQuiz = 0 // Kann bearbeitet werden um bei unterschiedlichen Kapiteln zu starten. Standard: 0
  let win = window.open("https://moodle.mosbach.dhbw.de/")
  let frame

  win.onload = () => {
    win.document.body.innerHTML = '<iframe id="frame" src="https://moodle.mosbach.dhbw.de/mod/lesson/view.php?id=146432&pageid=11267&startlastseen=no" frameborder="0" style="width: 100vw; height: 100vh; display: block"></iframe>'
    frame = win.document.getElementById("frame")
    frame.onload = () => {
      if (nextQuiz > 0 || !submitNext()) {
        nextQuiz = nextQuiz || 1
        openNextQuiz()
      }
    }
  }

  function submitNext() {
    let branchButtonContainers = frame.contentDocument.getElementsByClassName("branchbuttoncontainer")

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
    const question = questionContainer.innerText.trim()
    console.log(`Q: ${question}`)
    return answers[question.replace(/\n/g, '')]
  }

  function getElementsOfAnswers(correctAnswers) {
    let answerElements = []
    let answerOptions = frame.contentDocument.getElementsByClassName("form-check-label")
    if (answerOptions.length == 0) answerOptions = frame.contentDocument.getElementsByClassName("form-check")
    for (let ans of answerOptions) {
      const index = correctAnswers.indexOf(ans.innerText.trim().replace(/\n/g, ''))
      if (index >= 0) {
        console.log(`A: ${correctAnswers[index]}`)
        answerElements.push(ans.getElementsByTagName("input")[0])
      }
    }
    return answerElements
  }

  function getSubmitAnswerForm() {
    return frame.contentDocument.querySelectorAll("form[action='https://moodle.mosbach.dhbw.de/mod/lesson/continue.php']")[0]
  }

  function getContinueForm() {
    return frame.contentDocument.querySelectorAll("form[action='https://moodle.mosbach.dhbw.de/mod/lesson/view.php']")[0]
  }

  function openNextQuiz() {
    if (quizes.length >= nextQuiz) {
      const resetUrl = quizes[nextQuiz++ - 1]
      frame.onload = () => {
        frame.onload = () => answerQuiz()
        frame.src = resetUrl
      }
      console.log(`Jumping to quiz: ${resetUrl}`)
      frame.src = resetUrl.split("&")[0]
    } else {
      frame.onload = () => {}
      frame.src = "https://moodle.mosbach.dhbw.de/course/view.php?id=7838"
    }
  }

  function answerQuiz() {
    if (!submitNext()) {
      const answers = getAnswer()
      if (answers) {
        getElementsOfAnswers(answers).forEach(e => e.checked = true)
        getSubmitAnswerForm().submit()
      } else {
        const continueForm = getContinueForm()
        if (continueForm) getContinueForm().submit()
        else if (!frame.contentDocument.getElementsByClassName("form-check-label").length && !frame.contentDocument.getElementsByClassName("form-check").length) openNextQuiz()
      }
    }
  }

  const answers = {
    "ürfen private Kaffeemaschinen in den Unterrichtsräumen betrieben werden?": ["Nein."],
    "In welchen Räumen ist den Studierenden der Verzehr von Speisen und Getränken gestattet? In ...": ["Studentenaufenthaltsräumen, Cafeteria bzw. Räumen, in denen Getränkeautomaten aufgestellt sind"],
    "Welche der beiden folgenden Aussagen ist richtig?": [
      "Alle Einrichtungsgegenstände und Räumlichkeiten der DHBW Mosbach sind pfleglich zu behandeln. Beschädigungen oder Funktionsstörungen (z.B. bei Getränkeautomaten, Kopierern) sind umgehend den Hausmeistern, einem der Sekretariate oder dem Laborpersonal zu melden.",
      "Unterstreichungen und Herausreißen von Seiten sind nicht gestattet."      
    ],
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
      "Alle Unfälle, auch anscheinend harmlose, sind sofort der Aufsichtsperson zu melden.",
      "Lediglich einzelne Seiten oder Kapitel aus Büchern dürfen vervielfältigt werden.",
      "Füllen Sie Arbeitsstoffe niemals in Gefäße, die für die Aufbewahrung von Lebensmitteln bestimmt sind.",
      "Vor der Inbetriebnahme pneumatischer Schaltungen sind diese von der aufsichtsführenden Person zu überprüfen."
    ],
    "„Mit dem Betreten der Gebäude der DHBW wird die Haftung für unbeaufsichtigte Gegenstände (z.B. Laptops, Kleidungsstücke, Taschen) von der DHBW Mosbach abgedeckt.“ Ist diese Aussage richtig?": ["Nein."],
    "„Das Anbringen von Plakaten und Aushängen im Bereich der DHBW Mosbach bedarf der Genehmigung.“ Ist diese Aussage richtig?": ["Ja. Es ist nicht erlaubt, in der DHBW Mosbach beliebig Plakate aufzuhängen. Dazu stehen den Studierenden Pin-Wände zur Verfügung."],
    "Welche Aussage ist zum Thema „Rauchen“ richtig?": ["Gemäß Landesnichtraucherschutzgesetz (LNRSchG) ist in allen Gebäuden der DHBW Mosbach das Rauchen gesetzlich untersagt. Im Außenbereich ist das Rauchen nur an gesondert ausgewiesenen Plätzen gestattet. An diesen Stellen befinden sich auch Aschenbecher. Im direkten Außenbereich der Haupteingänge der Gebäude ist das Rauchen nicht erlaubt."],
    "Welche Aussage ist zum Thema „Feiern auf dem Campus“ richtig?": ["Feiern jeglicher Art (Grillfeste, Abschlussfeiern usw.) sind grundsätzlich nicht zulässig. In begründeten Einzelfällen können derartige Veranstaltungen nach vorheriger Genehmigung und unter bestimmten Voraussetzungen durch die Verwaltungsleitung durchgeführt werden."],
    "Welche Aussage ist zum Thema „Parken“ richtig?": [
      "Parkplätze dürfen nur während der Vorlesungs- und Klausurzeit sowie während eines Bibliotheksbesuchs genutzt werden.",
      "Die Parkregelungen in der Haus- und Laborordnung sind zu beachten. Die Straßenverkehrsordnung gilt auf dem Gelände der DHBW Mosbach."
    ],
    "„Die Unfallverhütungsrichtlinien betreffen gewerbliche Betriebe und finden bei der DHBW Mosbach keine Anwendung. Dort gilt nur die Haus- und Laborordnung.“ Ist diese Aussage richtig?": ["Nein."],
    "Welche Maßnahmen sind durchzuführen, falls Verbandsmaterial aus den Verbandskästen entnommen worden ist?": [
      "Zur Sicherstellung der Nachweisbarkeit des Unfalls ist für den Betroffenen ein Eintrag im Verbandbuch vorzunehmen.",
      "Nach der Entnahme von Verbandsmaterial ist zu veranlassen, dass der Verbandskasten wieder aufgefüllt wird."
    ],
    "Wie haben Sie sich auf den Grundstücken und in den Gebäuden der DHBW Mosbach zu verhalten?": [
      "Betriebsteile (Labore, Kellerräume usw.), in denen Sie nichts zu tun haben, dürfen nicht betreten werden.",
      "Stolper- und Rutschgefahren z.B. Gegenstände in den Verkehrswegen oder verschüttete Flüssigkeiten, wie Kaffee usw. sind von Ihnen sofort zu beseitigen. Ggf. ist Hilfe hinzuzuziehen."
    ],
    "Wie schnell darf auf dem Gelände der DHBW Mosbach gefahren werden?": ["nicht schneller als 20 km/h"],
    "Welches Verhalten am Arbeitsplatz (Unterrichtsraum, Labore, Büro) schreibt die Haus- und Laborordnung vor?": [
      "Der Arbeitsplatz ist sauber und in Ordnung zu halten.",
      "Elektrische Betriebsmittel sind vor dem Gebrauch auf Beschädigungen zu prüfen."
    ],
    "Schwere Gegenstände sollten immer niedrig stehen. Ist das einmal nicht der Fall und Sie müssen etwas von einem höheren Ort / Regal herunterholen gehen Sie wie folgt vor:": ["Sie steigen auf einen sicheren Tritt oder eine Leiter und holen sich den Gegenstand herunter."],
    "Dürfen Brandschutztüren und Rauchabschlüsse (Treppenraumtüren) während der Betriebszeiten (7.00 - 19.00 Uhr) festgebunden bzw. festgekeilt werden?": ["Nein, sie dürfen niemals festgebunden bzw. festgekeilt werden oder sonst in ihrer Funktion beeinträchtigt werden."],
    "Welche Vorgehensweise ist im Brandfall richtig?": ["Ruhe bewahrenMenschenleben rettenBrennende Personen durch Wälzen auf dem Boden löschen; auch Feuerlöscher sind für Personenbrände geeignet.Feuer telefonisch melden (siehe Alarmplan).Klein- und Entstehungsbrände werden mit Feuerlöscher sofort bekämpft.Angriffswege für die Feuerwehr freihalten.Feuerwehr einweisen"],
    "Angenommen, die Brandmeldeanlage oder die elektrische Sirene hat ausgelöst. Was ist zu tun?": ["Nach Alarmauslösung ist der Raum umgehend zu verlassen. Vorher sind Maschinen und elektrische Geräte auszuschalten.Gekennzeichnete Fluchtwege bzw. Türen sind zu benutzen (siehe auch Flucht- und Rettungspläne).Aufzüge dürfen nicht benutzt werden. Brandschutztüren sind zu schließen.Neulinge und hilfsbedürftige Personen sind zu unterstützen.Der Sammelplatz ist aufzusuchen."],
    "Unter welchen Umständen sollen/dürfen im Brandfall eigene Löschversuche unternommen werden?": ["Löschversuche dürfen nur ohne Gefährdung der eigenen Person durchgeführt werden (Vorgehen nur bis zur Rauchgrenze, nicht in verrauchte Bereiche). Eventuell sind mehrere Feuerlöscher zu benutzen.Personenbrände können mittels Wälzen auf dem Boden oder mit Feuerlöscher gelöscht werden."],
    "Während Sebastian an einem Rechner der DHBW arbeitet, stürzt das System ab. Dabei werden die Daten eines USB-Sticks den er verwendet gelöscht und lassen sich nicht wieder herstellen. „Da musst du dich beschweren.“ sagt Claudia „Da du an einem Rechner der Hochschule gearbeitet hast, muss die dir auch deine Daten wiederbeschaffen.“Hat Claudia Recht?": ["Nein hat sie nicht. Jeder ist selber für die Sicherung seiner Daten verantwortlich."],
    "Während der Übung im CAD-Labor stellt Christoph fest, dass der Computer deutlich schneller ist als sein eigener PC zuhause: „Wenn ich hier das neue Spiel installiere, das auf meinem PC nicht richtig läuft, kann ich es endlich mal ausprobieren und mit den anderen mitreden.“ Kurzerhand packt er beim nächsten Mal die DVD des Spiels ein, um es im CAD-Labor auszuprobieren.Darf Christoph das?": ["Nein. Mitgebrachte oder per Download beschaffte Software darf grundsätzlich nicht eingesetzt werden."],
    "Bei der Arbeit im CAD-Labor bemerkt Laura, dass ihr Computer komische Geräusche macht und auf ihre Eingaben nicht mehr reagiert. Sie fragt eine Kommilitonin was zu tun sei. Diese antwortet: „Gar nichts, die prüfen einmal am Tag ob mit den Rechnern alles in Ordnung ist.“Liegt dir Kommilitonin mit ihrer Aussage richtig?": ["Die Kommilitonin liegt falsch. Störungen des Systems müssen den Zuständigen der DHBW Mosbach unverzüglich mitgeteilt werden."],
    "Christoph hat das Passwort seines DHBW Accounts vergessen. Mit Hilfe eines Passwort-Crackers versucht er nun sich die nötigen Daten wieder zu beschaffen.Darf er das?": ["Nein, der Einsatz von Programmen, wie z.B.: Passwort-Cracker, ist grundsätzlich nicht erlaubt."],
    "Im Rahmen seines Studiums nutzt Raphael eine Software zum technischen Zeichnen, die ihm durch die DHBW zur Verfügung gestellt wird. Ein Freund, der an einer anderen Hochschule  studiert, ist beeindruckt von den Möglichkeiten der Software und möchte sie für sein Studium nutzten. „Kein Problem.“ sagt Raphael „ Ich brenn dir einfach die CD mit dem Programm, dann kannst du auch damit arbeiten.“Ist das möglich?": ["Nein, Software darf grundsätzlich nicht vervielfältigt oder an Dritte weitergeben werden, auch nicht an Freunde oder Verwandte."],
    "Oliver hat während seiner Bachelorarbeitsphase von seinem Betreuer an der DHBW ein Programm zum technischen Zeichnen zur Verfügung gestellt bekommen. Während der Ausarbeitung seiner Arbeit hat er viele gute Erfahrungen mit dem Zeichenprogramm gemacht und möchte es, da er es ja jetzt schon auf seinem Computer installiert hat, auch nach dem Ende seines Studiums weiterverwenden.Ist das möglich?": ["Nein, Oliver darf das Programm nach dem Ende seines Studiums nicht weiter verwenden."],
    "Neulich im Computerraum der DHBW: Flo und Nina wollen vor der Vorlesung noch schnell Ihre Emails lesen. Da meint Flo zu Nina: „He, Nina! Deine Mutter meint, Du sollst heute nach der Vorlesung nicht zu spät nach Hause kommen“. „Ja, alles klar. Du spinnst wohl“, Nina verdreht die Augen und tippt genervt ihre Zugangsdaten ein. Ein paar Sekunden vergehen. Dann wird sie abwechselnd knallrot und kreidebleich: „Sag mal, Du Idiot, liest Du etwa meine Emails?“. „Na klar“, antwortet Flo mit einem Grinsen.Wie lautete vermutlich Ninas Passwort, das Flo ohne weiteres geknackt zu haben scheint? (Mehrere Antworten erforderlich!)": ["Mosbach", "Nina15031989"],
    "Christian, Fabian und Björn sind passionierte Computerspieler und spielen gerne zusammen. Da sich die drei außerhalb der DHBW selten sehen schlägt Christian in einer Pause zwischen zwei Vorlesungen vor, eine Runde ihres aktuellen Lieblingsspiels zu spielen und hierzu das Netzwerk der DHBW Mosbach zu nutzen.In welchem Rahmen ist das möglich?": ["Die Nutzung des Rechnernetzwerkes der DHBW Mosbach für Netzwerk-Spiele u.ä. ist grundsätzlich nicht gestattet."],
    "Frederike möchte ihr Notebook an das studentische Netz der DHBW Mosbach anschließen.Welche Grundvoraussetzungen muss Sie beachten?": ["Zu ihrem eigenen Schutz sowie zum Schutz der anderen Nutzer des Netzes muss Frederike folgende Grundvorrausetzungen beachten. Sie muss sicherstellen, dass ihr Computer:- Passwort geschützt ist- Eine aktuelle Firewall-Software installiert und aktiviert ist ,- Keine Freigaben vorhanden sind- Und ein aktueller Virenscanner installiert und aktiviert ist."],
    "Am Nachmittag gönnen sich die Studenten immer eine Stärkung in der Cafeteria. Dort sitzen sie zusammen, quatschen oder arbeiten an ihren Rechnern. Das hatte Marco heute auch vor. Er steht vor dem Kaffeeautomaten. Hinter ihm ruft jemand lauthals: „He schaut mal, der kleine Marco! Heute gar nicht Deine riesige Schultüte dabei? Und die lässige weiße Kniebundhose trägst Du ja auch nicht!“ Lautes Gelächter ertönt. Marco dreht sich um und sieht seine privaten Fotos auf dem Laptopbildschirm eines Kommilitonen. „Wo hast du die denn geklaut?“ - er wäre am liebsten im Erdboden versunken.Können Sie sich die möglichen Antworten des Kommilitonen vorstellen? (Es können auch mehrere Antworten möglich sein!)": ["„Naja, als Du auf der Toilette warst, habe ich mich an Deinen Rechner gesetzt und mir das Bild einfach kopiert. Dein Laptop war ja nicht gesperrt“.", "„Wieso geklaut? Sie sind doch für das Netzwerk freigegeben“. Der Mitstudent grinst. „Ja, aber doch nur für zuhause“, meint Marco. „Das denkst Du! Netzwerk ist Netzwerk…“", "„Du musst wohl einen Virus haben, es wurde vorher per E-Mail an alle geschickt“."],
    "Darf die persönliche Benutzerkennung und das dazugehörige Passwort weitergegeben werden?": ["Nein."],
    "Christoph möchte, das auch ein paar seiner Freunde die nicht an der DHBW-Mosbach studieren auf die nützlichen Dokumente der Moodle-Kurse zugreifen können. Er schlägt darum vor beim Rechenzentrum Nutzer-Accounts für seine Freunde erstellen zu lassen.Geht das?": ["Nein, die Nutzung der Lernplattform Moodle der DHBW Mosbach ist nur für Angehörige der Hochschule und Lehrbeauftragte, die im Rahmen der Lehre an der DHBW Mosbach tätig sind gestattet."],
    "Marion muss in Moodle noch schnell das Handout zu Ihrem Referat hochladen. Dieses soll bis um 12 Uhr mittags eingestellt sein. Der Dozent hat dazu in Moodle einen Upload-Bereich eingerichtet.Leider hat Marion Ihr Passwort vergessen. Sara, Ihre Kommilitonin, ist so hilfbereit und gibt Marion ihre Zugangsdaten zu Moodle.Handelt Marions Freundin Sara richtig oder falsch?": ["Sara handelt falsch. Die Moodle-Zugangsdaten dürfen nicht weitergegeben werden."],
    "Ein Dozent stellt den Studierenden verschiedene Dateien zur Vorbereitung auf die Klausur zur Verfügung.Oliver läd sich diese Dateien auf seine Festplatte. Weil die Inhalte aber so gut aufbereitet sind, möchte er diese gerne anderen zur Verfügung stellen und stellt die Dateien auf seine Internetseite.Darf Oliver das?": ["Nein, das ist nicht erlaubt!"],
    "Felix hat wie alle Studierenden an der DHBW Mosbach eine DHBW-E-Mail-Adresse. Parallel hat er auch eine private E-Mail-Adresse. Da die private E-Mail-Adresse nicht so viel Speicherplatz hat, hat er keine Weiterleitung von seinem DHBW-Mail-Account eingerichtet.Unter welchen Umständen kann Felix so handeln?": ["Ja, es ist in Ordnung, solange Felix regelmäßig (in der Regel täglich) alle Moodle-Kursräume aufruft, in denen er als Teilnehmer eingeschrieben ist, um alle aktuellen Informationen zu erhalten."],
    "Torben hat in der Bibliothek ein hervorragendes Buch zum Thema Buchführung entdeckt. Damit seine Kommilitonen auch von seinem Fund profitieren scannt er das gesamt Buch ein und stellt es im Moodle-Kursraum zur Verfügung.Darf er das?": ["Nein, Torben handelt falsch. Bücher dürfen nicht einfach so digitalisiert werden und anderen zur Verfügung gestellt werden."],
    "Kann ein Trainer alles sehen was in seinem Kursraum geschieht und auf die Veranstaltungsspezifischen Daten der Teilnehmer (wie Abgaben, Forenbeiträge, Zugriffsdatum und –zeit) zugreifen?": ["Ja."],
    "Samuel hat sich auf der letzten DHBW-Party mit ein paar Kommilitonen zerstritten. Weil er so wütend ist, schickt er den drei Studierenden über Moodle Nachrichten, in denen er die Kommilitonen beschimpft. In der Nachricht ist ebenfalls ein Link auf eine ausländerfeindliche Seite im Internet.Darf Samuel sich so verhalten?": ["Nein, auf keinen Fall."],
    "Marion und Felix waren gemeinsam im Urlaub. Sie haben dort viele Urlaubsfotos gemacht, die Sie Ihren Kommilitonen gerne zeigen möchten. Gut, dass Marion Kurssprecherin ist und in einem Moodle-Bereich Rechte zum Upload von Dateien hat. Sie schlägt vor, die Urlaubsfotos n Moodle hochzuladen.Ist das erlaubt?": ["Nein, in Moodle dürfen nur Daten zu Lehrzwecken an der DHBW Mosbach hochgeladen werden."],
    "Ich lerne den ganzen Tag in der Bibliothek. Darf ich hier essen und trinken?": ["Ja, aber mit Einschränkungen."],
    "Darf ich in der Bibliothek telefonieren?": ["Nein."],
    "Darf ich in der Bibliothek rauchen?": ["Nein, denn es könnte dadurch brennen."],
    "Darf ich Jacken und Taschen mit in die Bibliothek nehmen?": ["Die Jacke schon, die Tasche nicht."],
    "Ich habe mein Laptop in der Bibliothek dabei und arbeite damit. Als ich von der Toilette komme ist es defekt. Die DHBW ersetzt mir den Laptop. Ist diese Aussage richtig?": ["Nein, diese Aussage ist falsch, es wird keinerlei Haftung übernommen."],
    "Kann ich alles, was sich in der Bibliothek befindet ausleihen? Also auch Zeitschriften, CD´s und Lexika?": ["Ein Großteil der Bestände ist entleihbar, aber nicht alles."],
    "Hat die Bibliothek immer die gleichen Öffnungszeiten das ganze Jahr über?": ["Nicht immer, aber meistens."],
    "Stefan hat ein Buch ausgeliehen und kann es nun nicht mehr finden. Muss er jetzt das Buch ersetzen?": ["Ja, als Entleiher haftet er für die Bücher."],
    "Ingrid hat ein Buch ausgeliehen und braucht es dringend. Wird schon nichts passieren, denkt Sie sich und überzieht die Leihfrist um mehrere Wochen. Was passiert?": ["Sie erhält Mahnungen und muss das Buch auch noch ersetzen."],
    "Ingrid hat ausgeliehene Bücher nicht fristgerecht zurück gegeben. Nun müsste sie eigentlich Mahngebühren zahlen. Ingrid ist sauer. Die Gebühren zahlt sie einfach nicht. Was soll schon passieren?": ["Spätestens zum Ende des Studiums sind alle Medien zurückzugeben und alle Gebühren zu begleichen."],
    "Darf ich Bücher, die ich ausgeliehen habe, an Kommilitonen weitergeben?": ["Das Buch muss immer beim Entleiher sein, da dieser dafür haftet."],
    "Bald ist Klausur: Stefan und Ingrid sind in einem Kurs und benötigen das gleiche Buch. Da Stefan sowieso in die Bibliothek geht, gibt ihm Ingrid den Ausweis und er soll ihr ein Buch mitbringen. Ist das möglich?": ["Nein, Ingrid muss selbst vorbeikommen."],
    "Kann ich ausgeliehene Bücher reservieren?": ["Na klar. Einfach im Online Katalog auf „Bestellen“ klicken."],
    "Ich brauche das Buch für die Vorbereitung auf die Klausur für einen bestimmten Zeitpunkt. Kann ich das auch zeitlich reservieren, so dass ich es sicher habe?": ["Nein, denn dann würden das ja alle tun."],
    "Ich finde überhaupt nichts zu meinem Thema an Literatur in der Bibliothek. Welche Möglichkeiten habe ich? Geben Sie an, welche der genannten Möglichkeiten richtig ist.": ["Ich kann bei Bedarf Anschaffungsvorschläge für Bücher für die Bibliothek machen oder Literatur aus anderen Bibliotheken bestellen."],
    "Kann ich elektronische Zeitschriften und Ebooks auch von zu Hause aus nutzen?": ["Manche ja, manche nein, das kommt auf den Lizenzvertrag an."],
    "Darf ich mir Ebooks herunterladen?": ["Ja, aber unter bestimmten Bedingungen."],
    "Was ist vor dem Einschalten von Geräten und Anlagen sicherzustellen?": ["Es ist sicherzustellen, dass niemand daran arbeitet. Der Bediener muss in den Umgang mit dem betreffenden Gerät bzw. der betreffenden Anlage unterwiesen sein. Versuchsaufbauten müssen vor Inbetriebnahme durch eine zweite Person (in der Regel die zuständige Aufsichtsperson) überprüft worden sein."],
    "Welche der beiden Aussagen ist richtig?": ["Es müssen aus Gründen der Unfallhilfe und des Geräteschutzes mindestens zwei Personen gleichzeitig anwesend sein."],
    "Müssen beim Umgang mit Blech und bei Transportarbeiten Schutzhandschuhe getragen werden?": ["Ja. Unbedingt."],
    "Müssen bei Bohr-, Dreh- und Fräsarbeiten sowie anderen Maschinen mit rotierenden Werkzeugen Schutzhandschuhe getragen werden?": ["Nein, das ist verboten."],
    "Bei Augenverletzungsgefahr - Schleifen, Bearbeiten spröder Materialien - ist eine Schutzbrille zu tragen. Gilt das auch für Brillenträger?": ["Ja. Diese müssen die Schutzbrille über ihrer normalen Brille tragen."],
    "Wann muss Gehörschutz getragen werden? Woran kann man das erkennen?": ["Immer dann, wenn die Lärmexposition in dem betreffenden Bereich oder bei Arbeit mit dem betreffenden Betriebsmittel den zulässigen Wert überschreitet.Erkennbar ist das am Gehörschutzsymbol in bzw. vor dem betreffenden Bereich oder direkt an der Maschine bzw. in der Betriebsanweisung der Maschine."],
    "Welche persönliche Schutzausrüstung ist an der Ständerbohrmaschine Pflicht?": ["Schutzbrille und ggf. Haarnetz (bei langen Haaren)"],
    "Welche Antwort ist richtig?": ["Beim Umgang mit gefährlichen Arbeitsstoffen sind die Hinweise und Sicherheitsratschläge zu beachten (Betriebsanweisungen). Die notwendigen Unterweisungen sind per Unterschrift zu bestätigen."],
    "Welche Vorgehensweise ist beim Wechsel von Werkzeugen (z.B. Bohrer, Schleifscheibe) bei elektrischen Handmaschinen richtig?": ["Der Werkzeugwechsel bei elektrischen Handmaschinen darf nur bei ausgeschalteter Maschine und gezogenem Stecker erfolgen."],
    "Welche Aussage ist zutreffend?": ["Die Nutzung von Werkzeugen, Maschinen und Einrichtungen darf nur nach Einweisung in das betreffende Gerät und ausdrücklicher Genehmigung durch das Laborpersonal erfolgen. Dabei ist die vorgesehene persönliche Schutzausrüstung zu benutzen (siehe auch Hinweise an den Maschinen). Die Einweisung gilt nur für diejenigen Maschinen und Geräte, an denen diese Unterrichtung auch tatsächlich erfolgt ist. Dies hat der Benutzer dem einweisenden Dozenten, Laboringenieur oder Labormeister durch seine Unterschrift auf dem entsprechenden Vordruck zu bestätigen. Ein Anspruch auf die Nutzung der Maschinen besteht nicht."],
    "Was muss bei der Verwendung von offenem Feuer (Gasflamme usw.) beachtet werden?": ["Ein geeigneter Feuerlöscher muss in unmittelbarer Nähe vorhanden sein. Während der Versuchsdurchführung muss das Aufsichtspersonal anwesend sein. Die Verwendung von offenem Feuer (Gasflamme etc.) in den Laborräumen bedarf der ausdrücklichen Genehmigung der zuständigen Aufsichtsperson."],
    "Kann es gefährlich sein, bei gezogenem Netzstecker elektrische Geräte zu öffnen und an diesen zu hantieren bzw. zu arbeiten?": ["Ja. Kondensatoren können Restladungen haben. Solange dies der Fall ist, besteht die Gefahr eines lebensgefährlichen Stromschlags."],
    "Ab welchem Spannungswert können elektrische Spannungen bereits lebensgefährlich sein?": ["Ab 42V."],
    "Was ist nach Abschluss der Laborübungen zu tun?": ["Der Arbeitsplatz und die benutzten Geräte, Messmittel usw. sind einwandfrei zu säubern, in den ursprünglichen Zustand zurückzuversetzen und aufzuräumen."],
    "Wie sind anfallende Späne oder umweltschädliche Stoffe zu entsorgen?": ["Bitte sprechen Sie das Laborpersonal an."]
  }

  const quizes = [
    "https://moodle.mosbach.dhbw.de/mod/lesson/view.php?id=85862&pageid=9093&startlastseen=no",
    "https://moodle.mosbach.dhbw.de/mod/lesson/view.php?id=113378&pageid=10202&startlastseen=no",
    "https://moodle.mosbach.dhbw.de/mod/lesson/view.php?id=85864&pageid=9149&startlastseen=no",
    "https://moodle.mosbach.dhbw.de/mod/lesson/view.php?id=85865&pageid=9180&startlastseen=no",
    "https://moodle.mosbach.dhbw.de/mod/lesson/view.php?id=85866&pageid=9204&startlastseen=no"
  ]

} else {
  console.log("Gehe zuerst auf https://moodle.mosbach.dhbw.de/ und melde dich an.")
}
