import React,{useState,useEffect} from 'react';
import Head from 'next/head'
import Image from 'next/image'
import { useLazyQuery } from '@apollo/client';
import styles from '../styles/Home.module.css'
import { Grid,TextField,useTheme,Box, Typography,Button } from '@mui/material';
import { CSSProperties } from '@emotion/serialize';
import { useDispatch ,useSelector} from 'react-redux';
import { useSnackbar } from 'notistack';
import { myFilter } from '../public/common/types';
import { getUsers } from '../public/gql/getUSer';
import { setUser } from '../public/Store/user';
import { user } from '../public/common/types';

 const Home= () => {
  const theme=useTheme();
  const classes=useStyle(theme);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch=useDispatch();
 const all_users=useSelector((appStore:any)=>appStore?.userState);
  const[tempUser,setTempUser]=useState<user[]>([]);
  const [sortedItems,setSortedItems]=useState<user[]|[]>([]);
  const [searchItem,setSearchItem]=useState<{value:string,error:boolean}>({
    value:'',
    error:false,
  });
  const errorAlert=(msg:string)=>{
		return (
		  enqueueSnackbar(msg,{variant:'error'})
		)
	  }
  const [currentFilters,setCurrentFilters]=useState<myFilter[]|[]>([
    {name:'JAVA',selected:false},
    {name:'DEVOPS',selected:false},
    {name:'C#',selected:false},
    {name:'REACT',selected:false},
    {name:'ANGULAR',selected:false},
    {name:'NODE',selected:false}
     ]);
     const [dateArray,setDateArray]=useState<any[]|[]>([]);
     const [sortDateArray,setSortDateArray]=useState<any[]|[]>([]);
     let testSet=new Set();
     let sortSet=new Set();
    
   const[allUsers]=useLazyQuery(getUsers,{
    onError:(error)=>{
    console.log(error);
    },
    onCompleted:(data)=>{
    dispatch(setUser(data.allUsers));
    }
   })

   useEffect(()=>{
    allUsers();
   },[]);

   useEffect(()=>{
    testSet.clear();
    tempUser.map((e:user,i:any)=>{
      testSet.add(e.date);
    });
    setDateArray(Array.from(testSet))
   },[tempUser])


   useEffect(()=>{
    setTempUser(all_users.user);
    ;
   },[all_users]);
      

   useEffect(()=>{
     filterItems();
   },[currentFilters])

   useEffect(()=>{
    sortSet.clear();
    sortedItems.map((e:user,i:any)=>{
      sortSet.add(e.date);
    });
    setSortDateArray(Array.from(sortSet))
   },[sortedItems]);


   const filterSelection=(e:myFilter,selection:boolean)=>{
     const tempFilter=[...currentFilters];
        tempFilter.map((user,i)=>{
          if(user.name==e.name){
          return tempFilter[i].selected=!selection;
          }
          setCurrentFilters(tempFilter);
        })
   }  
     
   const filterItems=()=>{
      let filterParam:string[]=[];
      currentFilters.map((e,i)=>{
        if(e.selected){
          filterParam.push(e.name);
        }
      });
      // things to be filtered.
      let tempArray:user[]=[];
      filterParam.map((e,i)=>{
      let temp:user[]=[];
      temp=tempUser.filter((user)=>user.category==e);
      tempArray.push(...temp)
      });
    setSortedItems(tempArray);
   }

   const searchItems=()=>{
    if(!searchItem.value){
       errorAlert('Enter a valid name')
    }else{
    if(sortedItems.length>0){
    let tempItems:user[]=sortedItems.filter(value => value.name.toLowerCase().includes(searchItem.value.toLowerCase()));
    setSortedItems(tempItems);
     }else{
      let tempItems2:user[]=tempUser.filter(value => value.name.toLowerCase().includes(searchItem.value.toLowerCase()));
      setSortedItems(tempItems2);
     }
    }
   }
  useEffect(()=>{
    if(searchItem.value.length===0){
      setSortedItems([]);
    }
  },[searchItem.value])
  return (
   <Grid container sx={classes.container as CSSProperties}>
    <Grid item lg={12} md={12} sm={12} xs={12} sx={classes.body}>
     <Box sx={classes.searchCont as CSSProperties}>
      <TextField 
       placeholder='Search by name' 
       sx={classes.searchField as CSSProperties}
        onChange={(e)=>setSearchItem({...searchItem,value:e.target.value})}
        InputProps={{                               
          endAdornment:
              <Button sx={classes.searchBtn} onClick={()=>searchItems()}>
                  Search
              </Button>
      }}
      />
     </Box>

     <Box sx={classes.filterCont}>
        {currentFilters.map((e,i)=>{
          return(
            <Box  key={i} onClick={()=>filterSelection(e,e.selected)}
             sx={{...classes.filterItem,border:`${e.selected?'1px solid yellow':'1px solid #000'}`}} >
         <Typography sx={{...classes.filTxt,color:`${e.selected?'yellow':'#000'}`}}  >
         {e.name}
         </Typography>
        </Box>
          )
        })}
     </Box>

     <Box sx={classes.dataCont}>
       {sortDateArray.length>0? 
      sortDateArray.map((e,i)=>{
        return(
        <>
        <Box key={i} sx={classes.dateTxt}>{e.split('T')[0]}:</Box>
           {sortedItems&&sortedItems.map((user,numb)=>{
            if(user.date==e){
              return  <Box key={numb} sx={classes.items as CSSProperties}>
              <img style={{width:'120px'}} width={50} height={100} src={user.image}/>
                <Box sx={classes.details}><Typography>
                {user.name}
                  </Typography>
                  <Typography>
                {user.category}
                  </Typography>
                  <Typography>
                {user.date.split('T')[0]}
                  </Typography>
                  </Box>
              </Box>
            }
           })}
       
        </>)
             
       })
       :
       dateArray.length>0&&dateArray.map((e,i)=>{
        return(
        <>
        <Box  key ={i} sx={classes.dateTxt}>{e.split('T')[0]}:</Box>
           {tempUser&&tempUser.map((user,numb)=>{
            if(user.date==e){
              return  <Box key={numb} sx={classes.items as CSSProperties}>
              <img style={{width:'120px'}} width={50} height={100} src={user.image}/>
                <Box sx={classes.details}><Typography>
                {user.name}
                  </Typography>
                  <Typography>
                {user.category}
                  </Typography>
                  <Typography>
                {user.date.split('T')[0]}
                  </Typography>
                  </Box>
              </Box>
            }
           })}
       
        </>)
             
       })}
     </Box>

    </Grid>
   </Grid>
  )
}

const  useStyle=(theme:any)=>({
  items:{
  display:'flex',
  flexDirection:'row',
  marginTop:'10px',
  marginBottom:'10px'
  },
 
  details:{
   width:'70%',
   backgroundColor:'#B9D9D7',
   marginLeft:'10px',
   display:'flex',
   flexDirection:'column',
   justifyContent:'center',
   padding:'5px'
  },
  dataCont:{
   minHeight:'120px',
   width:'100%',
   marginTop:'20px'
  },
  dateTxt:{
  width:'120px',
  height:'40px',
  fontWeight:500,
  display:'flex',
  justifyContent:'center',
  alignItems:'center',
  backgroundColor:"#E4DBDB",
  marginTop:'40px'
  },
  filterCont:{
   height:'100px',
   width:'100%',
   display:'flex',
   flexDirection:'row',
   flexWrap:'wrap'
  },
  filTxt:{
  fontWeight:600,
  fontSize:'15px',
  },
  
  filterItem:{
    height:'40px',
    width:'120px',
    borderRadius:'5px',
    marginTop:'10px',
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    margin:'10px',
    '&:hover':{
      border:'1px solid yellow',
      pointer:'cursor'
    }
  },

  searchCont:{
   width:'100%',
   display:'flex',
   height:'70px',
   flexDirection:'row',
  },
  searchField:{
  width:'100%',
  height:'100px'
  },
  container:{
     width:'100%',
     minHeight:'300px',
     display:'flex',
     flexDirections:"row",
     alignSelf:'center',
     justifyContent:'center',
     padding:'20px'
  },
  body:{
  border:'1px solid #000',
  width:'80%',
  minHeight:'200px',
  backgroundColor:'#fff',
  borderRadius:'5px',
  display:'flex',
  flexDirection:'column',
  justifyContent:'center',
  alignItems:'center',
  padding:'10px'
  },
  searchBtn:{
    width:'100px',
    color:'#fff',
    backgroundColor:'yellow',
    '&:hover':{
      color:'#000'
    }
  }
})

export default Home;