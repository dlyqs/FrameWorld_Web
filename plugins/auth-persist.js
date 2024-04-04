// plugins/auth-persist.js
import { getUser as getLocalStorageUser } from '~/utils/localstorage';
import { useUser } from '~/composables/states';

export default () => {
    if (process.client) {
        const storedUser = getLocalStorageUser();
        if (storedUser) {
            const user = useUser();
            user.value = storedUser;
        }
    }
}
