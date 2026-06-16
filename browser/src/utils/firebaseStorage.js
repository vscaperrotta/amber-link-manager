import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from '../common/firebase.js';

export async function uploadThumbnail(uid, linkId, dataUrl) {
	const storageRef = ref(storage, `users/${uid}/thumbnails/${linkId}.jpg`);
	await uploadString(storageRef, dataUrl, 'data_url');
	return getDownloadURL(storageRef);
}
