import { useState, useEffect } from "react"

import { PromptElement } from "../../components/promptElement/promptElement"

import * as promptService from "../../../services/promptService"
import "./landingPage.css"
import { Link } from "react-router-dom"

function LandingPage(props) {

    // Prompts Set Up Area
    const [prompts, setPrompts] = useState([])

    useEffect(() => {
        const getPrompts = async () => {
            const tempData = await promptService.getAllPrompts()
            await tempData.forEach(data => {
                data.promptImageData = data.promptImageData.split(',').map(Number);
            });
            setPrompts(tempData)
        }
        getPrompts()
    }, [])

    const [userPrompts, setUserPrompts] = useState([])

    useEffect(() => {
        if (!props.user) return
        const getUserPrompts = async () => {
            const tempData = await promptService.getAllUserPrompts(props.user.user_id)
            await tempData.forEach(data => {
                data.promptImageData = data.promptImageData.split(',').map(Number);
            });
            setUserPrompts(tempData)
        }
        getUserPrompts()
    }, [])

    // Images Set Up Area
    const [images, setImages] = useState([])


    return (
        <div>
            <header>
                <h1>Wave Function Collapse</h1>
                <h5>What A Beauty</h5>
            </header>
            <main id="landingMainDiv">
                <div className="promptListContainer">
                <h1>Use Prompts</h1>
                <div className="promptList">
                    {prompts.map((prompt) => {
                        return (
                            <PromptElement url="/image/create/" id={prompt.id} promptWidth={prompt.promptWidth} promptHeight={prompt.promptHeight} promptName={prompt.promptName} imageData={prompt.promptImageData} keyvalue={prompt.id} />
                        )
                    })}
                </div>
                </div>
                {props.user.user_id ?
                    <div className="promptListContainer">
                        <h1>Edit Your Prompts</h1>
                        <div className="promptList">
                            {userPrompts.map((prompt) => {
                                return (
                                    <PromptElement url="/prompts/" id={prompt.id} promptWidth={prompt.promptWidth} promptHeight={prompt.promptHeight} promptName={prompt.promptName} imageData={prompt.promptImageData} keyvalue={prompt.id} />
                                )
                            })}
                        </div>
                    </div>
                    :
                    <></>
                }
                <div id="imageList">
                    {images.map((image) => {
                        return (
                            <div></div>
                        )
                    })}
                </div>
            </main>
        </div>
    )
}

export { LandingPage }