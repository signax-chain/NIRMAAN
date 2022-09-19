export default {
    data() {
        return {
            emailRules: [
                (v) => !!v || 'E-mail is required',
                (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
            ]
        }
    },
    methods: {
        /**
         * @param  {} maxLength=80
         * @param  {} paragraph
         */
        truncateParagraph(maxLength = 80, paragraph) {
            if (paragraph === undefined || paragraph === null) return ""
            return paragraph.length <= maxLength
                ? paragraph
                : paragraph.substring(0, maxLength) + "...";
        },
        /**
         * @param  {} e
         */
        readOnlyNumbers(e) {
            return e.charCode >= 48 && e.charCode <= 57
                ? e.target.value
                : e.preventDefault();
        },
        /**
         * @param  {} arr
         * @param  {} el
         */
        insertInBetweenOfAnArray(arr = [], el = "") {
            return arr.splice(arr.length - 1, 0, el).join();
        },
        /**
         */
        getCurrentOrigin() {
            return location.origin
        },
        capitalize(word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        },
    }
}