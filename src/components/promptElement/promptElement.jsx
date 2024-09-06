import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"

import "./promptElement.css"

function PromptElement (props) {

    const promptDisplayCanvasRef = useRef(null)

    useEffect(() => {
        const canvas = promptDisplayCanvasRef.current
        const ctx = canvas.getContext("2d")
        ctx.putImageData(new ImageData(new Uint8ClampedArray(props.imageData), props.promptWidth, props.promptHeight, {colorSpace:"srgb"}),0,0)
    }, [promptDisplayCanvasRef])

    return (
    <div id="promptElementContainer" key={props.keyValue}>
        <Link to={`${props.url}${props.id}`}>
        <h4 id="elementName" >{props.promptName}</h4>
        <canvas id="elementCanvas" width={props.promptWidth} height={props.promptHeight} ref={promptDisplayCanvasRef}></canvas>
        </Link>
    </div>
    )
}

export {PromptElement}