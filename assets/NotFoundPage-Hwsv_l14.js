import{E as e,I as t,c as n,d as r,g as i,i as a,m as o,n as s,t as c,z as l}from"./copy-DVAqUdkf.js";import{a as u,t as d}from"./index-frGhH1Sa.js";import{n as f,t as p}from"./PageContainer-OTlZnQQY.js";var m=l(t(),1),h=l(i(),1);function g(){(0,m.useEffect)(()=>{window.scrollTo(0,0)},[]);let t={container:{maxWidth:600,margin:`0 auto`,paddingTop:o[10],paddingBottom:o[10],textAlign:`center`},errorCode:{fontSize:120,fontWeight:700,color:a.accentOrange,margin:0,marginBottom:o[4],lineHeight:1},heading:{fontSize:n.h1.desktop,fontWeight:700,color:a.textPrimary,margin:0,marginBottom:o[3]},subtitle:{fontSize:n.h3.desktop,color:a.textSecondary,margin:0,marginBottom:o[7],lineHeight:r.h3},link:{display:`inline-block`,minHeight:48,background:a.accentOrange,border:`none`,borderRadius:8,color:a.textPrimary,fontSize:n.body.desktop,fontWeight:600,textDecoration:`none`,cursor:`pointer`,padding:`${o[3]}px ${o[6]}px`,transition:`opacity 200ms ease`,lineHeight:`48px`}},i=`
    @media (max-width: ${s.mobile-1}px) {
      .error-code {
        font-size: 80px !important;
      }
      .error-heading {
        font-size: ${n.h2.mobile} !important;
      }
      .error-subtitle {
        font-size: ${n.body.mobile} !important;
      }
    }
    .error-link:hover {
      opacity: 0.9;
    }
  `;return(0,h.jsxs)(h.Fragment,{children:[(0,h.jsxs)(u,{children:[(0,h.jsxs)(`title`,{children:[`404 — Page Not Found — `,c.productName]}),(0,h.jsx)(`meta`,{name:`robots`,content:`noindex`})]}),(0,h.jsx)(`style`,{children:i}),(0,h.jsx)(d,{}),(0,h.jsx)(p,{children:(0,h.jsxs)(`div`,{style:t.container,children:[(0,h.jsx)(`div`,{style:t.errorCode,className:`error-code`,children:`404`}),(0,h.jsx)(`h1`,{style:t.heading,className:`error-heading`,children:c.errors.notFound}),(0,h.jsx)(`p`,{style:t.subtitle,className:`error-subtitle`,children:c.errors.notFoundSub}),(0,h.jsx)(e,{to:`/`,style:t.link,className:`error-link`,children:c.errors.backHome})]})}),(0,h.jsx)(f,{})]})}export{g as default};