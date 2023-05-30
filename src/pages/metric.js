// import React from 'react';
// import './questions.css';

// const Metric = ({name, date, cultures, correct, totalQuestions}) => {

//     const metricSection = () => {
//         return (
//             <tbody>
//                 <tr>
//                 <td>{name}</td>
//                 {cultures ? (
//                     <td>{date.split("T")[0]}</td>
//                 ) : (
//                     <td>Expected: {date.split("T")[0]}</td>
//                 )}
//                 {cultures ? (
//                     <td>{cultures}</td>
//                 ) : (
//                     <td>N/A</td>
//                 )}
//                 {cultures ? (
//                     <td>{correct}/{totalQuestions}</td>
//                 ) : (
//                     <td>N/A</td>
//                 )}
//                 </tr>
//             </tbody>
//         )
//     }

//     return(
//         <div className="course">
//         <table>
//         {metricSection()}
//         </table>
//     </div>
//     )
        
//     }

// export default Metric;