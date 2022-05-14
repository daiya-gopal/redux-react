import React from 'react';
import { useState,useEffect,useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useForm } from 'react-hook-form';
import { userData  } from './actions/index';
//import { useSelector,useDispatch } from 'react-redux';

 const App = () => {

   const getuserdata    = useSelector((state) => state.setuserData); 
   const dispatch = useDispatch();
   const [getData, updateData] = useState([]);
   const { register, handleSubmit, formState: { errors },reset,setValue } = useForm();

   const fetchData = async () => {
     await axios.get("https://jsonplaceholder.typicode.com/users")
    .then(res => {

      
      updateData(res.data);
      dispatch(userData(res.data));

      }).catch(()=> { 
        console.log('Not valid')   
     })   
   };
 
    
   const onSubmit = (values) => {

        if(getuserdata!=""){
 

              if(values!=''){

                    const updateitem = getuserdata.filter((ele, ind)=>{ 
                     
                        if(ind == values.id){ 
                            
                            ele.name     = values.name;
                            ele.email    = values.email;
                            ele.phone    = values.phone;
                            ele.address  = {'city' : values.city,'zipcode':values.zip}
                        }
 
                      return ele
                 });   

                let updated_array = updateitem;
                dispatch(userData(updated_array));
                updateData(updated_array);
 
                 }else{


                  let submitdata =
                  [{ 
                      'name'    : values.name,
                      'email'   : values.email,
                      'phone'   : values.phone,
                      'address' : {'city' : values.city,
                      'zipcode'     : values.zip},
                  }]
    

                let updated_array = [...submitdata,...getuserdata];
                dispatch(userData(updated_array));
                updateData(updated_array);
              }

              reset();

          }
        }
    

        
  const del = useCallback( async (vl)=>{

    if (window.confirm("Delete the item?")) {
        
        if(getuserdata!=""){

          const updateitem = getData.filter((ele, ind)=>{
              return ind != vl;
          });   

           dispatch(userData(updateitem));
           updateData(updateitem);
          }
    }
  },
  [getData]
)


  const edit =(vl)=>{
      
    if(getuserdata!=""){

      const updateitem = getData.filter((ele, ind)=>{
          return ind == vl;
      });   
       setValue("name",updateitem[0]['name']);
       setValue("email",updateitem[0]['email']);
       setValue("phone",updateitem[0]['phone']);
       setValue("city",updateitem[0]['address']['city']);
       setValue("zip",updateitem[0]['address']['zipcode']);
       setValue("id",vl);
      } 
  }

  useEffect(() => {
    if(getuserdata!=""){ 
        updateData(getuserdata);
        }else{
        fetchData();
     }
   }, [getData]);

   return (
    <>

  <div style={{margin:'30px auto',width:300,}}>
    <Form onSubmit={handleSubmit(onSubmit)} noValidate  method="post" action="" autoComplete="off">
     
      <input type={'hidden'} {...register("id")} value={''}/> 
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" 
         {...register("name", { required: true, required: 'required field.'})} />
         {errors.name && <p className="text-error">{errors.name.message}</p>}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" 
          {...register("email", { required: true, required: 'required field.'})} />
          {errors.email && <p className="text-error">{errors.email.message}</p>}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Phone</Form.Label>
        <Form.Control type="text" 
          {...register("phone", { required: true, required: 'required field.'})} />
          {errors.phone && <p className="text-error">{errors.phone.message}</p>}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>City</Form.Label>
        <Form.Control {...register("city", { required: true, required: 'required field.'})} />
          {errors.city && <p className="text-error">{errors.city.message}</p>}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Zip</Form.Label>
        <Form.Control {...register("zip", { required: true, required: 'required field.'})} />
          {errors.zip && <p className="text-error">{errors.zip.message}</p>}
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
    </div>  

        <Table striped bordered hover>
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City</th>
                <th>-</th>
              </tr>
            </thead>
            <tbody>


       { getData!="" ?  
           getData?.map((dt,key) => {    
              return(<tr key={key}>
                <td>{key+1}</td>
                <td>{dt.name}</td>
                <td>{dt.email}</td>
                <td>{dt.phone}</td>
                <td>{dt.address.city} <br/>
                    Zip : {dt.address.zipcode}
                </td>
                <td><div onClick={()=> edit(key) }>Edit </div> <br/> <div onClick={()=> del(key) }> Delete </div></td>
              </tr>)
              }) 
            : <span>please wait...</span> }
            </tbody>
          </Table> 
    </>
  )
}

export default App