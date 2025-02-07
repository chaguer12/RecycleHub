export class User{
        constructor(
            public id: string,
            public fullName: string,
            public email: string,
            public password: string,
            public city: string,
            public address: string,
            public birthday: string,
            public role: 'particulier' | 'collecteur', 
            public profilePicture?: string,
            public collectionZones?: string[],
            public rating?: number,
            public completedCollections?: number
        ){}
}