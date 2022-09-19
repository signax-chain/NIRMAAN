export default {
    methods: {
        /**
         * @param  {} min
         */
        convertMinutesToHours(min) {
            const hours = Math.floor(min / 60);
            const minutes = min % 60;
            return hours + 'h ' + minutes + "m";
        }
    }
}