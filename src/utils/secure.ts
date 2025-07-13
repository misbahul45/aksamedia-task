export async function hashPw(pw:string): Promise<string> {
    const encoder=new TextEncoder()
    const data=encoder.encode(pw)
    const hashBuffer=await crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(hashBuffer)).map(b=>b.toString(16).padStart(2,'0')).join('')
}

export async function verifyPw(pw:string, hash:string): Promise<boolean> {
    const hashed=await hashPw(pw)
    return hashed===hash
}