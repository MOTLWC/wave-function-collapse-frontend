import { useState, useEffect, useRef } from 'react'

import * as WFCLogic from "./imageCreateLogic.js"
import * as promptService from "../../../services/promptService.js"
import "./imageCreatePage.css"
import { useParams } from 'react-router-dom'

function ImageCreatePage() {

  // Input Prompts Set Up


  // Prompt Area

  const { promptId } = useParams()
  const [prompts, setPrompts] = useState([])
  // ! Should Be Null On Start
  const [selectedPrompt, setSelectedPrompt] = useState(null)

  const [patternSymmetry, setPatternSymmetry] = useState(2)

  const allTiles = useRef([])
  const patternTiles = useRef([])

  useEffect(() => {
    const fetchData = async () => {
      // Assuming you have a function to fetch prompts
      const tempData = await promptService.getAllPrompts();
      setPrompts(tempData);

      const matchedPrompt = tempData.find(prompt => prompt.id === Number(promptId));
      if (matchedPrompt) {
        setSelectedPrompt(`${matchedPrompt.promptWidth}/${matchedPrompt.promptHeight}/${matchedPrompt.promptImageData}`);
      } else {
        setSelectedPrompt(null)
      }
      const eventData = [matchedPrompt.promptWidth, matchedPrompt.promptHeight, matchedPrompt.promptImageData]
      allTiles.current = await WFCLogic.initPromptSelected(eventData[2].split(",").map(Number), Number(eventData[0]), Number(eventData[1]))
      patternTiles.current = await WFCLogic.getPatternCells(allTiles.current, patternSymmetry)
    };

    fetchData();
  }, [promptId])

  async function handleSelectedPromptChange(event) {
    setSelectedPrompt(event.target.value)
    console.log(eventData)
  }

  useEffect(() => {
    const WhyCantEffectsBeAsync = async () => {
      const eventData = selectedPrompt.split("/")
      console.log(eventData)
      allTiles.current = await WFCLogic.initPromptSelected(eventData[2].split(",").map(Number), Number(eventData[0]), Number(eventData[1]))
      patternTiles.current = await WFCLogic.getPatternCells(allTiles.current, patternSymmetry)
    }
    WhyCantEffectsBeAsync()
  }, [selectedPrompt, patternSymmetry])

  // Output Stuff

  const [outputWidth, setOutputWidth] = useState(40)
  const [outputHeight, setOutputHeight] = useState(40)

  function handleWidthChange(event) {
    setOutputWidth(event.target.value)
  }

  function handleHeightChange(event) {
    setOutputHeight(event.target.value)
  }

  function handelSymmetryChange(event) {
    setPatternSymmetry(event.target.value)
  }
  // Logic Stuff

  function runWFC() {
    WFCLogic.initGenerate(patternTiles.current, outputWidth, outputHeight)
  }

  //!  Prompt Processing 
  return (
    <>
      <header>
        <h1>Generate An Image</h1>
      </header>
      <main>
        <div id="generationSettingsContainer">
          <div id="promptContainer">
            <div id="outputSettings">
              <label>Prompt Input</label>
              <select id="promptInput" value={selectedPrompt} onChange={handleSelectedPromptChange}>
                {prompts.map((prompt) => {
                  return (
                    <option key={prompt.id} value={`${prompt.promptWidth}/${prompt.promptHeight}/${prompt.promptImageData}`}>{prompt.promptName}</option>
                  )
                })}
                <option disabled defaultChecked={true} selected={true} value={null}>NONE</option>
              </select>
            </div>
            <canvas id="promptDisplay" width={0} height={0}></canvas>
          </div>
          <div id="outputSettings">
            <label htmlFor="outputHeight">Output Height</label>
            <input type="number" id="outputHeight" value={outputHeight} onChange={handleHeightChange}></input>
            <label htmlFor="outputWidth">Output Width</label>
            <input type="number" id="outputWidth" value={outputWidth} onChange={handleWidthChange}></input>
            <label htmlFor="patternSymmetry">Pattern Symmetry Selector</label>
            <select id="patternSymmetry" value={patternSymmetry} onChange={handelSymmetryChange}>
              <option value={0}>None</option>
              <option value={1}>Reflections</option>
              <option value={2}>Reflections and Rotations</option>
            </select>
          </div>
        </div>
        <div id="generationOutputContainer">
          <button onClick={runWFC}>Generate</button>
          <canvas id="outputCanvas" width={0} height={0}></canvas>
          {/* TESTING DELETE */}
          <div id="TestDisplayForCells">
          </div>
          <div id="TestDisplayForPatternCells">
          </div>
        </div>
      </main>
    </>
  )
}

export { ImageCreatePage }