// all calls to myFetch MUST be surrounded by Try Catch

export const fetchData = async (url, options) => {
    const result = {
        isOk: false,
        data: null 
    }

    let res;
    try {
        res = await fetch(url, options);
        if (res.ok && res.status < 300) {
            result.data = await res.json();
            result.isOk = true;
        } else {
            throw new Error (`Fetch to ${url} failed with status ${res.status}`);
        }
    } catch (error) {
        console.error(`Fetch to ${url} failed with status ${res.status}`);

    }

    return result;
  }