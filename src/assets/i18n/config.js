/**
 * Created by lyx on 2022/1/17.
 */
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import store from '@/store'
import i18nMsg from './langs'
import locale from 'element-ui'

Vue.use(VueI18n)

const i18n = new VueI18n({
    locale: store.state.modules.locale || 'en',
    messages: {
        'zh-hans': i18nMsg['zh-hans'],
        'en': i18nMsg.en,
    },
    silentTranslationWarn: true
});
locale.i18n((key, value) => i18n.t(key, value))

export default i18n
