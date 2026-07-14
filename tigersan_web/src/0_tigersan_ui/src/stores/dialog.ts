import Dialog from '../components/Dialog/Dialog.vue'
import { defineStore, getActivePinia } from 'pinia'
import { shallowReactive, type ComputedRef } from 'vue'
import { Texts } from '../texts'
import { Colors } from '../base'
import { StoreIDs } from './base/StoreIDs'
import { ComponentHelper } from '../helpers'
import { DialogMode, DialogModel, type DialogCallback } from '../models'

/* 仓库 */
export const useDialogStore = defineStore(StoreIDs.dialog, () => {
  let dialogModels = shallowReactive<DialogModel[]>([])
  return { dialogModels }
})

export class DialogHelper {
  private static Init() {
    if (document.querySelector('.dialog-mask')) return

    ComponentHelper.AppendApp(Dialog)
  }

  static Show(
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

  static Information(msg: string) {
    DialogHelper.Show(Texts.Information, msg)
  }

  static Success(msg: string) {
    DialogHelper.Show(Texts.Success, msg, undefined, undefined, DialogMode.NoButton, Colors.Success)
  }

  static Warning(msg: string) {
    DialogHelper.Show(Texts.Warning, msg, undefined, undefined, DialogMode.NoButton, Colors.Warning)
  }

  static Error(msg: string) {
    DialogHelper.Show(Texts.Error, msg, undefined, undefined, DialogMode.NoButton, Colors.Danger)
  }
}