import { IdModel, IdModelHelper } from "./IdModel"
import { AxiosHelper } from "../../helpers/AxiosHelper"

/** ID名称对 */
export class IdNameModel extends IdModel {
    name = ''
}

export class IdNameModelHelper<TModel extends IdNameModel> extends IdModelHelper<TModel> {
    constructor(action: string) {
        super(action)
    }

    // 查:
    readonly SelectIdName = async () => await AxiosHelper.SelectIdName(this._action)
}