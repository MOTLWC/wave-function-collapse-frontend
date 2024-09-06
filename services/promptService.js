const BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;

async function create(formData) {
    try {
        // Send the Base64 image to the backend
        const response = await fetch(`${BACKEND_URL}prompts/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                promptName: formData.promptName,
                promptImageData: formData.promptImageData,
                promptWidth: formData.promptWidth,
                promptHeight: formData.promptHeight,
                createdBy: formData.createdBy
            }),
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Image uploaded successfully:', result);
        } else {
            console.error('Failed to upload image:', response.statusText);
        }
    } catch (error) {
        console.error('Error in uploadImage:', error);
    }
}

async function getAllPrompts() {
    try {
        const res = await fetch(`${BACKEND_URL}prompts/`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        return data;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

async function getAllUserPrompts (userId) {
    try {
        const res = await fetch(`${BACKEND_URL}prompts/get-by-user/${userId}/`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${localStorage.getItem("token")}`
            },
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        return data;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

async function getPromptById(promptId) {
    try {
        const res = await fetch(`${BACKEND_URL}prompts/${promptId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        return data;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

async function updatePrompt(formData) {
    try {
        const response = await fetch(`${BACKEND_URL}prompts/${formData.id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                promptName: formData.promptName,
                promptImageData: formData.promptImageData,
                promptWidth: formData.promptWidth,
                promptHeight: formData.promptHeight,
                createdBy: formData.createdBy
            }),
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Image uploaded successfully:', result);
        } else {
            console.error('Failed to upload image:', response.statusText);
        }
    } catch (error) {
        console.error('Error in uploadImage:', error);
    }
}

async function deletePrompt(promptId) {
    try {
        const response = await fetch(`${BACKEND_URL}prompts/${promptId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${localStorage.getItem("token")}`
            },
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Image uploaded successfully:', result);
        } else {
            console.error('Failed to upload image:', response.statusText);
        }
    } catch (error) {
        console.error('Error in uploadImage:', error);
    }
} 

export { create, getAllPrompts, getAllUserPrompts, getPromptById, updatePrompt, deletePrompt }