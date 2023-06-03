import React, { useEffect, useState } from 'react'

const GetAbility = (abiurl) => {
    console.log(abiurl);
    const [abisum,setAbisum] = useState('');
    useEffect(() => {
        const getabi = async() =>{
            try{
                console.log('this is working');
                const response =  await fetch(abiurl.abiurl);
                const data =  await response.json();
                //console.log(data.flavor_text_entries[0].flavor_text);
                setAbisum(data.flavor_text_entries[0].flavor_text);
            } catch (error) {
                console.log(error);
              }
              
        };
        getabi();
    },[abiurl.abiurl])
    
    console.log(abisum);
    //const  abisummary = getabi();
    //console.log(abisummary);
    //const summary = abisummary.flavor_text_entries[0].flavor_text;
  return (
    <>
    <div>{abisum}</div>
    </>
  );
};

export default GetAbility;