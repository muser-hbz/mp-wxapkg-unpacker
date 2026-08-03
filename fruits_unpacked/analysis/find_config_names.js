// 确定 to[0][198] 的值（第一组配置表的属性名）
const fs = require('fs');
const content = fs.readFileSync('d:/project/mp-wxapkg-unpacker/fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js', 'utf8');

function Qs(t){const n=Array.from(t);for(let r=0,i=t.length-1;r<i;r++,i--){const e=n[r];n[r]=n[i];n[i]=e}return n.join('')}
const toTables={};
const qsPattern=/\$s=Qs\("/g;let qm;
while((qm=qsPattern.exec(content))!==null){
    const qsStart=qm.index+qm[0].length;let qi=qsStart;
    while(qi<content.length){if(content[qi]==='\\'){qi+=2;continue}if(content[qi]==='"')break;qi++}
    const rev=content.substring(qsStart,qi);
    const aq=content.substring(qi+1,qi+200);
    const am=aq.match(/^,(\d+)\),to\[(\d+)\]=\$s\.s\((\d+)\)/);
    if(am){const cs=parseInt(am[1]);const ti=parseInt(am[2]);
        let f;try{f=JSON.parse('"'+rev+'"')}catch(e){f=rev}
        const r=Qs(f);const ch=[];
        for(let i=0;i<r.length;i+=cs)ch.push(r.substring(i,i+cs));
        toTables[ti]=ch;
    }
}

console.log('to[0][198]:', toTables[0] ? toTables[0][198] : 'N/A');
console.log('to[0][197]:', toTables[0] ? toTables[0][197] : 'N/A');
console.log('to[0][199]:', toTables[0] ? toTables[0][199] : 'N/A');

// 找第一组配置(this[t[0][198]])的上下文
const ctx1 = content.indexOf('this[t[0][198]]=');
if (ctx1 >= 0) {
    const before = content.substring(Math.max(0,ctx1-200), ctx1);
    console.log('\n=== 第一组配置上下文 ===');
    console.log(before.substring(before.length-150));
}

// 找第二组配置(state machine @ 674468)的属性名
// 往前找 this[xxx]=
let searchPos = 674468;
while (searchPos > 674468 - 2000) {
    searchPos = content.lastIndexOf('this[', searchPos);
    if (searchPos < 0) break;
    const after = content.substring(searchPos, searchPos + 60);
    if (after.includes(']=function')) {
        console.log('\n=== 第二组配置属性名 ===');
        console.log('pos:', searchPos);
        console.log(after.substring(0, 60));
        break;
    }
    searchPos--;
}
