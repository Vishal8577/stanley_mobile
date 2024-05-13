// AuthService.js
import auth from "@react-native-firebase/auth";

export const createUser = (email, password) => {
    return auth().createUserWithEmailAndPassword(email, password);
};

export const signInUser = (email, password) => {
    return auth().signInWithEmailAndPassword(email, password);
};

export const handleForgotPassword = (email) => {
    // Firebase forgot password functionality
    return auth().sendPasswordResetEmail(email);
};

export const signOutUser = () => {
    return auth().signOut();
};

export const deleteUser = () => {
    return auth().currentUser.delete();
}