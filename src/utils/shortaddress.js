export const getShortAddress = (addr) => {
    let addressTxt = '';
    let addrLen = 0;
    if (addr)
        addrLen = addr.length;
    if (addr && addrLen > 10) {
        addressTxt = addr.substring(0, 5) + '...' + addr.substring(addrLen - 3, addrLen);
    }

    return addressTxt;
}