export class FileHelper {
    static GetInput(onchange: (files: FileList) => any): HTMLInputElement {
        const input = document.createElement('input') as HTMLInputElement
        input.type = 'file'
        input.onchange = e => {
            const target = e.target as HTMLInputElement
            if (target.files) onchange(target.files)
        }
        return input
    }
}