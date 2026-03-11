import { defineConfig } from 'vitepress'
import { join } from 'path'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const grammarsDir = join(__dirname, 'grammars')
const grammarNames = [
    'mj',
    'mj-regex',
    'mj-shell',
    'mj-asm',
    'mj-asm-arm32',
    'mj-asm-arm64',
    'mj-asm-msp430',
    'mj-asm-x86',
    'mj-asm-x86_64',
    'mj-asm-z80',
];
const langs = grammarNames.map(f => require(join(grammarsDir, f + '.tmLanguage.json')))


// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "The Mjolnir Programming Language",
    description: "The Mjolnir language, concepts, and toolchain reference",
    srcDir: "src",

    markdown: {
        theme: {
            dark: 'gruvbox-dark-soft',
            light: 'gruvbox-light-soft',
        },
        languages: langs
    },

    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        logo: '/logo.svg',

        nav: [
            { text: 'Home', link: '/' },
            { text: 'Getting Started', link: '/getting-started' }
        ],

        sidebar: [
            {
                text: 'Getting Started',
                items: [
                    { text: 'Getting Started', link: '/getting-started' },
                ]
            }
        ],

        socialLinks: [
            { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
        ]
    }
})
