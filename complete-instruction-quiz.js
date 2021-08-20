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
        if (answer) {
          getElementOfAnswer(answer).checked = true
          getSubmitAnswerForm().submit()
        } else {
          getSubmitAnswerForm().submit()
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
  var pageHeader = frame.contentDocument.getElementById("id_pageheader").innerHTML
  for (let ans in answers) {
    if (pageHeader.indexOf(ans) >= 0) {
      return answers[ans]
    }
  }
  return null
}

function getElementOfAnswer(answer) {
  const answeroptions = frame.contentDocument.getElementsByClassName("answeroption")
  for (let ans of answeroptions) {
    if (ans.innerText == answer) {
      return ans.getElementsByTagName("input")[0];
    }
  }
  return null
}

function getSubmitAnswerForm() {
  return frame.contentDocument.querySelectorAll("form[action='https://moodle.mosbach.dhbw.de/mod/lesson/continue.php']")[0]
}

const answers = {
  "Dürfen private Kaffeemaschinen in den Unterrichtsräumen betrieben werden?": "Nein."
}