import Dialog from '../components/Dialog/Dialog.vue'
import { defineStore, getActivePinia } from 'pinia'
import { shallowReactive, type ComputedRef } from 'vue'
import { Colors } from '../base'
import { StoreIDs } from './base/StoreIDs'
import { ComponentHelper } from '../helpers'
import { DialogMode, DialogModel, type DialogCallback } from '../models'
import { Texts } from '../texts.ts'

/* 仓库 */
export const useDialogStore = defineStore(StoreIDs.dialog, () => {
  let dialogModels = shallowReactive<DialogModel[]>([])
  return { dialogModels }
})

export class DialogHelper {
  private static Init() {
    if (document.querySelector('.dialog-mask')) return

    const body = document.querySelector('body')
    if (!body) {
      console.warn('The body is null!')
      return
    }

    const element = ComponentHelper.GetElement(Dialog)
    if (!element) {
      console.warn('The element is null!')
      return
    }
    body.appendChild(element)
  }

  static ShowDialog(
    title: string | ComputedRef<string>,
    msg: string,
    data?: any,
    callback?: DialogCallback,
    mode: DialogMode = DialogMode.NoButton,
    background: string = Colors.Brand) {
    if (!getActivePinia()) return

    DialogHelper.Init()

    let { dialogModels } = useDialogStore()

    var strMsg = msg.toString().trim()

    if (dialogModels.some(m => m.Msg.value === strMsg)) return

    dialogModels.push(new DialogModel(title, strMsg, data, callback, mode, background))
  }

  static ShowInformation(msg: string) {
    DialogHelper.ShowDialog(Texts.Information, msg)
  }

  static ShowSuccess(msg: string) {
    DialogHelper.ShowDialog(Texts.Success, msg, undefined, undefined, DialogMode.NoButton, Colors.Success)
  }

  static ShowWarning(msg: string) {
    DialogHelper.ShowDialog(Texts.Warning, msg, undefined, undefined, DialogMode.NoButton, Colors.Warning)
  }

  static ShowError(msg: string) {
    DialogHelper.ShowDialog(Texts.Error, msg, undefined, undefined, DialogMode.NoButton, Colors.Danger)
  }
}