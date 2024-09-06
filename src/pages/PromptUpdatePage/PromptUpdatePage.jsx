import { useState, useEffect, useRef } from "react"

import * as promptService from "../../../services/promptService"
import { redirect, useParams, useNavigate } from "react-router-dom"

function PromptUpdatePage(props) {

    const [colourPallet, setColourPallet] = useState([])

    // Canvas Settings
    const [canvasWidth, setCanvasWidth] = useState(20)
    const [canvasHeight, setCanvasHeight] = useState(20)

    function handleWidthChange(event) {
        setCanvasWidth(event.target.value)
    }

    function handleHeightChange(event) {
        setCanvasHeight(event.target.value)
    }

    // New Colour RGB Variables
    const [colourSliderValue, setColourSliderValue] = useState(0)
    const [colourRGB, setColourRGB] = useState([255,0,0,1])
    const [colourHex, setColourHex] = useState("#FF0000")

    const [saturation, setSaturation] = useState(100);
    const [brightness, setBrightness] = useState(100)

    function handleAddColour() {
        setColourPallet(...colourPallet,)
    }

    const handleChangeHueSlider = (event) => {
        setColourSliderValue(event.target.value);
    }

        const handleChangeSaturationSlider = (event) => {
            setSaturation(event.target.value);
        }

            const handleChangeBrightnessSlider = (event) => {
                setBrightness(event.target.value);
            }

    useEffect(() => {
        const sat = saturation / 100
        const bri = brightness / 100
        let r = 0;
        let g = 0;
        let b = 0;

        if (colourSliderValue <= 255) {
            r = 255;
            g = colourSliderValue;
            b = 0;
        } else if (colourSliderValue <= 510) {
            r = 510 - colourSliderValue;
            g = 255;
            b = 0;
        } else if (colourSliderValue <= 765) {
            r = 0;
            g = 255;
            b = colourSliderValue - 510;
        } else if (colourSliderValue <= 1020) {
            r = 0
            g = 1020 - colourSliderValue;
            b = 255
        } else if (colourSliderValue <= 1275) {
            r = colourSliderValue - 1020;
            g = 0;
            b = 255;
        } else if (colourSliderValue <= 1530) {
            r = 255;
            g = 0;
            b = 1530 - colourSliderValue;
        }
        // Bit Where I Change based on brightness and saturation

        // Adjust for saturation
        r = Math.floor(r * sat + 255 * (1 - sat));
        g = Math.floor(g * sat + 255 * (1 - sat));
        b = Math.floor(b * sat + 255 * (1 - sat));
        
        // Adjust for brightness
        r = Math.floor(r * bri);
        g = Math.floor(g * bri);
        b = Math.floor(b * bri);
        
        // Ensure values are within bounds
        r = Math.min(255, Math.max(0, r));
        g = Math.min(255, Math.max(0, g));
        b = Math.min(255, Math.max(0, b));

        setColourHex(`#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`.toUpperCase());
        setColourRGB([r,g,b,1])
    },[colourSliderValue, saturation, brightness]);

    // Canvas Drawing logic
    const canvasRef = useRef(null);
    const isDrawing = useRef(false);
    const isErasing = useRef(false);
    useEffect(() => {

        const startDrawing = (event) => {
            if (event.button === 0) isDrawing.current = true;
            else if (event.button === 2) isErasing.current = true;
            draw(event)
        };

        const stopDrawing = () => {
            isDrawing.current = false;
            isErasing.current = false;
            };

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        const draw = (event) => {
            if (!isDrawing.current && !isErasing.current) return;

            const rect = canvas.getBoundingClientRect();
            const x = Math.floor(event.clientX - rect.left) / 10;
            const y = Math.floor(event.clientY - rect.top) / 10;

            

            const cellData = ctx.getImageData(x,y,1,1)

            if (isDrawing.current) {
                cellData.data[0] = colourRGB[0]
                cellData.data[1] = colourRGB[1]
                cellData.data[2] = colourRGB[2]
                cellData.data[3] = 255
            }

            else if (isErasing.current) {
                cellData.data[0] = 0
                cellData.data[1] = 0
                cellData.data[2] = 0
                cellData.data[3] = 0
            }

            ctx.putImageData(cellData, x, y)

            // ctx.globalAlpha = 1
            // ctx.fillRect(x, y, 1, 1);
        };

        // Attach event listeners
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mousemove', draw);

        // Cleanup event listeners on unmount
        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('mousemove', draw);
        };
        
    }, [colourHex, isDrawing, canvasWidth]);

    // Saving And Uploading

    const promptToUpdate = useParams().promptId

    const [formData, setFormData] = useState({
        id: null,
        promptName : "",
        promptImageData : "",
        promptWidth: canvasWidth,
        promptHeight: canvasHeight,
        createdBy : props.user.user_id
    })

useEffect (() => {
    const getPromptData = async () => {
        const tempData = await promptService.getPromptById(promptToUpdate)
        tempData.promptImageData = tempData.promptImageData.split(',').map(Number);
        setFormData(tempData)
        const canvas = document.getElementById("promptCanvas")
        const ctx = await canvas.getContext("2d")
        ctx.putImageData(new ImageData(new Uint8ClampedArray(tempData.promptImageData), tempData.promptWidth, tempData.promptHeight, {colorSpace:"srgb"}),0,0)
    }
    getPromptData()
}, [])

    const handleChange = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value})
    }

    const CheckSubmit = () => {
        return !(promptName && formData.createdBy)
    }

    async function getImageData() {
        const canvas = canvasRef.current;
        const ctx = await canvas.getContext('2d', { willReadFrequently: true });
        const tempData = ctx.getImageData(0,0,canvasWidth,canvasHeight)
        formData.promptImageData = tempData.data.join(",")
    }

    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            // Runs user fetch from the services file
            await getImageData()
            const userResponse = await promptService.updatePrompt(formData)
            navigate("/")
        } catch (error) {
            alert("Something Went Wrong!")
        }
    }

    const handleDelete = async () => {
        try{
            await promptService.deletePrompt(promptToUpdate)
            navigate("/")
        } catch (error) {
            alert("Something Went Wrong!")
        }
    }
    const {id, promptName, promptWidth, promptHeight, createdBy} = formData

    return (
        <>
            <header>
                <h2>Update Your {promptName} Prompt</h2>
            </header>
            <main>
                <div id="controlePannel">
                    <div id="imageSettings">
                        <input type="number" value={canvasWidth} onChange={handleWidthChange}></input>
                        <input type="number" value={canvasHeight} onChange={handleHeightChange}></input>
                    </div>
                    <div id="colourPallet">
                        {colourPallet.map((colour, index) => {
                            return (
                                <p key={index} style={{ backgroundColor: colour }}>{colour}</p>
                            )
                        })}
                    </div>
                    <div id="createColour">
                        <div className="ColourSliderContainer">
                            <p>Hue</p>
                            <input id="hueSlider" style={{ background: colourHex }} className="slider" type="range" min={0} max={1530} value={colourSliderValue} onChange={handleChangeHueSlider}></input>
                            <p>Saturation</p>
                            <input id="saturationSlider" style={{ background: colourHex }} className="slider" type="range" min={0} max={100} value={saturation} onChange={handleChangeSaturationSlider}></input>
                            <p>Brightness</p>
                            <input id="brightnessSlider" style={{ background: colourHex }} className="slider" type="range" min={0} max={100} value={brightness} onChange={handleChangeBrightnessSlider}></input>
                            <p>{colourHex}</p>
                            <p>{colourRGB }</p>
                        </div>
                    </div>
                    {props.user.user_id?
                    <div id="promptSaving">
                        <input id="promptName" type="text" value={promptName} name="promptName" onChange={handleChange}></input>
                        <button disabled={CheckSubmit()} onClick={handleSubmit}>Update</button>
                        <button onClick={handleDelete}>DELETE</button>
                    </div>
                    :
                    <></>
                    }
                </div>
                <div id="canvasContainer">
                    <canvas onContextMenu={(event) => event.preventDefault()} ref={canvasRef} id="promptCanvas" width={`${canvasWidth}px`} height={`${canvasHeight}px`}></canvas>
                </div>
            </main>
        </>
    )
}

export {PromptUpdatePage}