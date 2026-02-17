import { shallowReactive } from 'vue'
import { defineStore } from 'pinia'
import { Colors } from '../base'
import { StoreIDs } from './base/StoreIDs'
import { DialogMode, DialogModel, type DialogCallback } from '../models'

/* 仓库 */
const useDialogStore = defineStore(StoreIDs.dialog, () => {
  let dialogModels = shallowReactive<DialogModel[]>([])

  return { dialogModels }
})

/* 方法 */
function ShowDialog(
  title: string,
  msg: string,
  callback?: DialogCallback,
  mode: DialogMode = DialogMode.NoButton,
  background: string = Colors.Brand) {
  let { dialogModels } = useDialogStore()

  dialogModels.push(new DialogModel(title, msg, callback, mode, background))
}

function ShowInformation(msg: string) {
  ShowDialog('Information', msg)
}

function ShowSuccess(msg: string) {
  ShowDialog('Success', msg, undefined, DialogMode.NoButton, Colors.Success)
}

function ShowWarning(msg: string) {
  ShowDialog('Warning', msg, undefined, DialogMode.NoButton, Colors.Warning)
}

function ShowError(msg: string) {
  ShowDialog('Error', msg, undefined, DialogMode.NoButton, Colors.Danger)
}

const dialog = {
  ShowDialog,
  ShowInformation,
  ShowSuccess,
  ShowWarning,
  ShowError,
}

export {
  DialogModel,
  useDialogStore,
  dialog,
}