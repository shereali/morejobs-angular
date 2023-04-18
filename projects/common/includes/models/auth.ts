export interface TokenData {
    aud: string;
    jti: string;
    iat: number;
    nbf: number;
    exp: number;
    sub: number;
    iss?: string;
    scopes: string[];
}


export interface AuthData {
    token_type: 'Bearer' | string;
    expires_in: any;
    access_token: string;
    refresh_token: string;
    user?: {
        id: number;
        uuid: string;
        name_en: string;
    };
}
