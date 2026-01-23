import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { Colors } from '../base'
import { DialogModel } from '../models'
import { StoreIDs } from './base/StoreIDs'

/* 仓库 */
const useDialogStore = defineStore(StoreIDs.dialog, () => {
  let dialogModels: DialogModel[] = reactive([])

  return { dialogModels }
})

/* 方法 */
function ShowDialog(
  title: string,
  msg: string,
  background: string = Colors.Brand) {
  let { dialogModels } = useDialogStore()

  dialogModels.push(new DialogModel(title, msg, background))
}

function ShowInformation(msg: string) {
  ShowDialog('Information', msg)
}

function ShowSuccess(msg: string) {
  ShowDialog('Success', msg, Colors.Success)
}

function ShowWarning(msg: string) {
  ShowDialog('Warning', msg, Colors.Warning)
}

function ShowError(msg: string) {
  ShowDialog('Error', msg, Colors.Danger)
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