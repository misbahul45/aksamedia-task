import { onMounted, ref, watchEffect } from "vue";
import type { Web_Theme } from "../interfaces";


const THEME_KEY='theme-mode'

export function useTheme(){
    const theme=ref<Web_Theme>('system')

    function getSystemTheme():'light' | 'dark'{
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    function applyTheme(mode:Web_Theme){
        const current=mode==='system' ?getSystemTheme():mode
        document.documentElement.classList.remove('dark','light')
        document.documentElement.classList.add(current)
    }

    function setTheme(mode:Web_Theme){
        theme.value=mode
        localStorage.setItem(THEME_KEY, mode)
        applyTheme(mode)
    }

    onMounted(()=>{
        const saved=localStorage.getItem(THEME_KEY) as Web_Theme || null
        theme.value=saved
        applyTheme(saved)

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (theme.value === 'system') {
                applyTheme('system')
            }
        })
    })

    watchEffect(()=>{
        applyTheme(theme.value)
    })

    return{
        theme, setTheme
    }
}