export class User{
        constructor(
            public fullName: string,
            public email: string,
            public password: string,
            public city: string,
            public address: string,
            public birthday: string,
            public role: 'particulier' | 'collecteur', 
            public profilePicture?: string
        ){}
}