import { startupsRef, fundingsRef } from "../config/firebase_services";

export default {
    methods: {
        async getFundings(id) {
            const documents = await fundingsRef
                .where("startup", "==", id)
                .get();
            let fundingReceived = 0;
            let fundingUtilized = 0;
            let fundingBalance = 0;

            documents.forEach((document) => {
                const data = document.data();

                if (data.type === "received") {
                    fundingReceived += +data.amount;
                }

                if (data.type === "utilized") {
                    fundingUtilized += +data.amount;
                }
            });

            const document = await startupsRef.doc(id).get();
            const funding = document.data().funding;

            if (
                funding.received !== undefined &&
                funding.received !== null &&
                funding.received !== "" &&
                funding.received !== 0
            )

                fundingReceived +=
                    parseFloat(funding.received.toString().split(",").join(""));

            if (
                funding.utilized !== undefined &&
                funding.utilized !== null &&
                funding.utilized !== "" &&
                funding.utilized !== 0
            )

                fundingUtilized +=
                    parseFloat(funding.utilized.toString().split(",").join(""));

            fundingBalance = fundingReceived - fundingUtilized;

            return { received: fundingReceived, utilized: fundingUtilized, balance: fundingBalance };
        },
    }
}