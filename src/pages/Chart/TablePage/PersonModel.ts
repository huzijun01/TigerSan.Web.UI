import JSONBig from 'json-bigint'
import { ArrayHelper, BigintHelper, ApiResult, Texts } from '../../../packages'

const Persons = 'persons'

export class PersonModel {
    id = 0n
    name = ''
    age = 0
    gender = true
    salary = 0.0
    joiningTime = new Date()
}

export class PersonHelper {
    private static Save(dataes: PersonModel[]) {
        const strPersons = JSONBig.stringify(dataes)
        localStorage.setItem(Persons, strPersons)
        return strPersons
    }

    static GetList(
        gender?: boolean,
        sort?: string,
        ascending?: boolean,
    ): PersonModel[] {
        let strPersons = localStorage.getItem(Persons)
        if (!strPersons) {
            strPersons = this.Save(GetTesPersonModels())
        }
        let persons = JSONBig.parse(strPersons) as PersonModel[] | undefined
        if (!persons) {
            return []
        }

        if (gender != undefined) {
            persons = persons.filter(i => i.gender === gender)
        }

        if (sort) {
            persons = ArrayHelper.Sort(persons, sort, ascending)
        }

        return persons
    }

    static Add = (data: PersonModel): ApiResult<PersonModel> => {
        try {
            const arr = this.GetList()
            if (arr.some(i => BigintHelper.IsEqualAndNotUndefined(i.id, data.id))) {
                return ApiResult.Error('The ID cannot be duplicated!')
            }

            arr.push(data)
            this.Save(arr)

            return ApiResult.Success(Texts.AddedSuccessfully.value)
        } catch (error) {
            return ApiResult.Error(error)
        }
    }

    static Edit = (data: PersonModel): ApiResult<PersonModel> => {
        try {
            const arr = this.GetList()
            const index = arr.findIndex(i => BigintHelper.IsEqualAndNotUndefined(i.id, data.id))
            if (index < 0) {
                return ApiResult.Error('Data does not exist!')
            }

            arr[index] = data
            this.Save(arr)

            return ApiResult.Success(Texts.EditedSuccessfully.value)
        } catch (error) {
            return ApiResult.Error(error)
        }
    }

    static Delete = (id: bigint): ApiResult<PersonModel> => {
        try {
            const arr = this.GetList()
            const index = arr.findIndex(i => BigintHelper.IsEqualAndNotUndefined(i.id, id))
            if (index < 0) {
                return ApiResult.Error('Data does not exist!')
            }

            arr.splice(index, 1)
            this.Save(arr)

            return ApiResult.Success(Texts.EditedSuccessfully.value)
        } catch (error) {
            return ApiResult.Error(error)
        }
    }
}

export const GetTesPersonModels = (): PersonModel[] => [
    {
        id: 1n,
        name: '张三',
        age: 18,
        gender: true,
        salary: 8000.01,
        joiningTime: new Date(),
    },
    {
        id: 2n,
        name: '李四',
        age: 19,
        gender: false,
        salary: 9000.02,
        joiningTime: new Date(),
    },
    {
        id: 3n,
        name: '王五',
        age: 20,
        gender: true,
        salary: 10000.03,
        joiningTime: new Date(),
    },
    {
        id: 4n,
        name: '赵六',
        age: 21,
        gender: false,
        salary: 11000.04,
        joiningTime: new Date(),
    },
    {
        id: 5n,
        name: '吴七',
        age: 22,
        gender: false,
        salary: 12000.05,
        joiningTime: new Date(),
    },
    {
        id: 6n,
        name: '周八',
        age: 23,
        gender: true,
        salary: 13000.06,
        joiningTime: new Date(),
    },
    {
        id: 7n,
        name: '郑九',
        age: 24,
        gender: true,
        salary: 14000.07,
        joiningTime: new Date(),
    },
    {
        id: 8n,
        name: '冯十',
        age: 25,
        gender: true,
        salary: 15000.08,
        joiningTime: new Date(),
    },
    {
        id: 9n,
        name: '赵云',
        age: 26,
        gender: true,
        salary: 16000.09,
        joiningTime: new Date(),
    },
    {
        id: 10n,
        name: '张飞',
        age: 27,
        gender: true,
        salary: 17000.10,
        joiningTime: new Date(),
    },
    {
        id: 11n,
        name: '关羽',
        age: 27,
        gender: true,
        salary: 18000.11,
        joiningTime: new Date(),
    },
    {
        id: 12n,
        name: '刘备',
        age: 28,
        gender: true,
        salary: 19000.12,
        joiningTime: new Date(),
    },
]