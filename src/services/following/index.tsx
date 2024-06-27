const getFollowing = async (name: string | null) => {
  const options = {
    headers: {
      'Authorization': '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' 
    }
  }
  return await fetch(`https://api.github.com/users/${name}/following`, options).then(res => res.json())
}

export {
  getFollowing
}