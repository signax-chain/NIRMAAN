import { storageRef } from '../config/firebase_services'
/**
 * @param  {} fileObject
 * @param  {} path
 */
const uploadFile = (fileObject, path) => {
    return new Promise((resolve) => {
        const firebaseStorageRef = storageRef.child(`${path}/${+new Date()}`)
            .put(fileObject)

        firebaseStorageRef.on("status_changed", (snapshot) => {
            //perform any actions
            console.log(snapshot.bytesTransferred);
        },
            (error) => {
                resolve(error)
            },
            async () => {
                const downloadURL = await firebaseStorageRef.snapshot.ref.getDownloadURL()
                resolve(downloadURL)
            }
        );
    })
}
/**
 * @param  {} fileObject
 * @param  {} path
 */
const uploadFileWithName = (fileObject, path) => {
    return new Promise((resolve) => {
        const firebaseStorageRef = storageRef.child(`${path}/${+new Date()}${fileObject.name}`)
            .put(fileObject)

        firebaseStorageRef.on("status_changed", (snapshot) => {
            console.log(snapshot.bytesTransferred);
        },
            (error) => {
                resolve(error)
            },
            async () => {
                const downloadURL = await firebaseStorageRef.snapshot.ref.getDownloadURL()
                resolve(downloadURL)
            }
        );
    })
}

export { uploadFile, uploadFileWithName }
