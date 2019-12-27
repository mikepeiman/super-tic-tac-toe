
  function saveTextAsFile() {
    setGameSettings();
    let settings = JSON.parse(localStorage.getItem("gameSettings"));
    let textToSave = {
      players: scoredPlayers,
      gameHistory: gameHistory,
      settings: settings
    };
    let textToSaveAsBlob = JSON.stringify(textToSave); // new Blob([JSON.stringify(textToSave)], { type: "text/plain" });
    let textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
    let fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs")
      .value;

    let downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);

    downloadLink.click();
  }

  function destroyClickedElement(event) {
    document.body.removeChild(event.target);
  }

  function loadFileAsText() {
    let fileToLoad = document.getElementById("fileToLoad").files[0];
    // let fileToLoad = 't2.txt'

    let fileReader = new FileReader();
    fileReader.onload = async function(fileLoadedEvent) {
      loadedData = JSON.parse(fileLoadedEvent.target.result);
      // document.getElementById("inputTextToSave").value = loadedData;
      console.log("loadedData from file: ", loadedData);
      console.log("loadedData.players from file: ", loadedData.players);
      scoredPlayers = await loadedData.players;
      console.log("scoredPlayers from file: ", scoredPlayers);
      await recreateGameHistoryFromCurrentPlayerInLS(loadedData.players);
    };

    console.log("scoredPlayers from file: ", scoredPlayers);
    fileReader.readAsText(fileToLoad, "UTF-8");
  }