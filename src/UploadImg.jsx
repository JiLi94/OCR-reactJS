import './App.css';
import { Buffer } from 'buffer'
import Tesseract from 'tesseract.js'

export default function UploadImg() {
    const fileSelectedHandler = event => {
        // the selected file
        let base64StringUS 
        let file = event.target.files[0]
        let reader = new FileReader()
        let uploadedImg = document.getElementById("uploadedImg")
        // when file read is done
        reader.onloadend = () => {
            // save the image as a Base64 in session storage
            base64StringUS = reader.result.replace("data:", "").replace(/^.+,/, "")
            sessionStorage.setItem("uploadedImg", base64StringUS)
            uploadedImg.src = "data:image/png;base64," + sessionStorage.getItem("uploadedImg")
        }
        //display the image
        reader.readAsDataURL(file)
        // imageToText()
    }

    const imageToText = () => {
        const buffer = Buffer.from(sessionStorage.getItem("uploadedImg"), 'base64')
        Tesseract.recognize(buffer, 'eng')
            .then(res => {
                updateTextarea(res.data.text);
            })
            .catch(err => console.log(err.message))
    }

    const updateTextarea = (text) => {
        let textarea = document.querySelector('textarea')
        textarea.innerHTML = text
    }

    const copyText = () => {
        let textarea = document.querySelector('textarea')
        console.log(textarea.textContent);
        navigator.clipboard.writeText(textarea.textContent)
            .then(() => {
                alert('Copied the text')
            })
            .catch(err => 'Error: ' + err.message)
    }

    return (
        <div id='image'>
            <input type='file' onChange={fileSelectedHandler} />
            <img id="uploadedImg" />
            {/* <textarea name="" id="" cols="30" rows="10">{imageToText()}</textarea> */}
            <div id='ocrResult'>
                <div id='ocrButtons'>
                    <button onClick={imageToText}>Convert</button>
                    <button onClick={copyText}>Copy result</button>                  
                </div>
                <textarea cols="80" rows="15"></textarea>
            </div>
        </div>
    )
}