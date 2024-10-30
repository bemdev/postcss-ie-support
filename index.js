const postcss = require('postcss');
// const { calculateCalcExpression } = require('./helpers')

module.exports = postcss.plugin('postcss-ie-support', () => {
    let hasDisplayFlex = false;

    return (root, result) => {
        root.walkDecls((decl) => {
            if (decl.prop.startsWith('--')) {
                const variableName = decl.prop;
                const value = decl.value;

                root.walkRules(rule => {
                    rule.walkDecls(decl => {
                        if (decl.value.includes(variableName)) {
                            decl.value = decl.value.replace(new RegExp(`var\\(${variableName}\\)`, 'g'), value);
                        }
                    });
                });
                // decl.remove();
            }

            if (decl.prop === 'display' && decl.value.includes('flex')) {
                hasDisplayFlex = true;
                const newValue = '-ms-flex';
                decl.cloneBefore({ prop: decl.prop, value: newValue });
            }

            if (decl.prop === 'display' && decl.value.includes('grid')) {
                const newValue = '-ms-grid';
                decl.cloneBefore({ prop: decl.prop, value: newValue });
            }

            if (decl.prop.startsWith('grid-template-columns') || decl.prop.startsWith('grid-template-rows')) {
                const newProp = decl.prop.replace(/^grid-template/, '-ms-grid-rows');
                decl.cloneBefore({ prop: newProp, value: decl.value });
            }

            if (decl.prop.startsWith('grid-column') || decl.prop.startsWith('grid-row')) {
                const newProp = decl.prop.replace(/^grid-/, '-ms-grid-');
                decl.cloneBefore({ prop: newProp, value: decl.value });
            }

            if (decl.prop.startsWith('align-items') && decl.value.includes('center')) {
                const newValue = '-ms-flex-align: center';
                decl.cloneBefore({ prop: 'display', value: '-ms-flex' });
                decl.cloneBefore({ prop: newValue.split(':')[0], value: newValue.split(':')[1].trim() });
            }

            if (decl.prop.startsWith('justify-content') && decl.value.includes('center')) {
                const newValue = '-ms-flex-pack: center';
                decl.cloneBefore({ prop: 'display', value: '-ms-flex' });
                decl.cloneBefore({ prop: newValue.split(':')[0], value: newValue.split(':')[1].trim() });
            }

            if (decl.prop.startsWith('transform')) {
                const newTransformProp = '-ms-transform';
                decl.cloneBefore({ prop: newTransformProp, value: decl.value });
            }

            if (decl.prop.startsWith('transition')) {
                const newTransitionProp = '-ms-transition';
                decl.cloneBefore({ prop: newTransitionProp, value: decl.value });
            }

            if (decl.prop.startsWith('animation')) {
                const newAnimationProp = '-ms-animation';
                decl.cloneBefore({ prop: newAnimationProp, value: decl.value });
            }

            if (decl.prop.startsWith('filter')) {
                const newFilterProp = '-ms-filter';
                decl.cloneBefore({ prop: newFilterProp, value: decl.value });
            }

            if (decl.prop.startsWith('gap') || decl.prop.startsWith('row-gap') || decl.prop.startsWith('column-gap')) {
                let newGapProp = 'grid-gap';

                if (hasDisplayFlex) {
                    hasDisplayFlex = false;
                    decl.cloneBefore({ prop: 'margin', value: decl.value });
                    decl.remove();
                } else {
                    decl.cloneBefore({ prop: newGapProp, value: decl.value });
                }
            }

            // if (decl.value.includes('calc(')) {
            //     const calculatedValue = calculateCalcExpression(decl.value);
            //     decl.cloneBefore({ prop: decl.prop, value: calculatedValue });
            // }
        });
    };
});