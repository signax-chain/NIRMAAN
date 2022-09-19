export default {
    data() {
        return {
            rules: {
                required: value => !!value || 'Required',
                minLength: value => (value && value.length >= 6) || 'Min 6 characters',
                maxLength: value => (value && value.length <= 12) || 'Max 12 characters',
                email: value => /.+@.+\..+/.test(value) || 'Invalid email',
                number: value => !isNaN(value) || 'Must be a number',
                minValue: value => value && value >= 1 || 'Min 1',
                maxValue: value => value && value <= 100 || 'Max 100',
            }
        }
    },
    methods: {
        readOnlyNumbers(e) {
            return e.charCode >= 48 && e.charCode <= 57
                ? e.target.value
                : e.preventDefault();
        },
    }
}