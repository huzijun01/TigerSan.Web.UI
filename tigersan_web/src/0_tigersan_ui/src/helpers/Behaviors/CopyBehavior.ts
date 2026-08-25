import { Texts } from "../../texts"
import { ToastHelper } from "../../models"

export class CopyBehavior {
    static async Copy(event: MouseEvent, str: string) {
        try {
            event.preventDefault()
            await navigator.clipboard.writeText(str)
            ToastHelper.Success(Texts.CopySuccessful.value)
        } catch (error) {
            ToastHelper.Error(error as string)
        }
    }
}