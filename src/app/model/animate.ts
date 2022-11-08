import { trigger, state, style, animate, animation, transition, group, query, stagger, animateChild } from '@angular/animations';
export const routeAnimation =
    trigger('routeAnimations', [
        transition(':enter', [
            style({ top: '-100%' }),
            animate('1s ease', style({ top: 0 })),
        ]),
        transition(':leave', []),
        transition('home => screener', [
            style({ position: 'relative' }),
            query('.footer_bg', [style({ display: 'none' })], { optional: true }), // 把底栏隐藏掉否则动画期间没有内容底栏位置会浮上去
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%'
                })
            ], { optional: true }), // {optional: true},设置query()查询是可选的，否则在查询不到的情况下会报错
            query(':enter', [
                style({ left: '100%' })
            ], { optional: true }),
            query(':leave', animateChild(), { optional: true }),
            group([
                query(':leave', [
                    animate('.5s ease', style({ left: '-100%' }))
                ], { optional: true }),
                query(':enter', [
                    animate('.5s ease', style({ left: '0' }))
                ], { optional: true })
            ]),
            query(':enter', animateChild(), { optional: true }),
        ]),
        transition('screener => home', [
            style({ position: 'relative' }),
            query('.footer_bg', [style({ display: 'none' })], { optional: true }), // 把底栏隐藏掉否则动画期间没有内容底栏位置会浮上去
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%'
                })
            ], { optional: true }), // {optional: true},设置query()查询是可选的，否则在查询不到的情况下会报错
            query(':enter', [
                style({ left: '-100%' })
            ], { optional: true }),
            query(':leave', animateChild(), { optional: true }),
            group([
                query(':leave', [
                    animate('.5s ease', style({ left: '100%' }))
                ], { optional: true }),
                query(':enter', [
                    animate('.5s ease', style({ left: '0' }))
                ], { optional: true })
            ]),
            query(':enter', animateChild(), { optional: true }),
        ]),
        transition('screener => hq', [
            style({ position: 'relative' }),
            query('.footer_bg', [style({ display: 'none' })], { optional: true }),
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%'
                })
            ], { optional: true }),
            query(':enter', [
                style({ left: '100%' })
            ], { optional: true }),
            query(':leave', animateChild(), { optional: true }),
            group([
                query(':leave', [
                    animate('.5s ease', style({ left: '-100%' }))
                ], { optional: true }),
                query(':enter', [
                    animate('.5s ease', style({ left: '0%' }))
                ], { optional: true })
            ]),
            query(':enter', animateChild(), { optional: true }),
        ]),
        transition('home => hq', [
            style({ position: 'relative' }),
            query('.footer_bg', [style({ display: 'none' })], { optional: true }),
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%'
                })
            ], { optional: true }),
            query(':enter', [
                style({ left: '-100%' })
            ], { optional: true }),
            query(':leave', animateChild(), { optional: true }),
            group([
                query(':leave', [
                    animate('.5s ease', style({ left: '100%' }))
                ], { optional: true }),
                query(':enter', [
                    animate('.5s ease', style({ left: '0%' }))
                ], { optional: true })
            ]),
            query(':enter', animateChild(), { optional: true }),
        ]),
        transition('hq => screener', [
            style({ position: 'relative' }),
            query('.footer_bg', [style({ display: 'none' })], { optional: true }),
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%'
                })
            ], { optional: true }),
            query(':enter', [
                style({ left: '-100%' })
            ], { optional: true }),
            query(':leave', animateChild(), { optional: true }),
            group([
                query(':leave', [
                    animate('.5s ease', style({ left: '100%' }))
                ], { optional: true }),
                query(':enter', [
                    animate('.5s ease', style({ left: '0%' }))
                ], { optional: true })
            ]),
            query(':enter', animateChild(), { optional: true }),
        ]),
        transition('hq => home', [
            style({ position: 'relative' }),
            query('.footer_bg', [style({ display: 'none' })], { optional: true }),
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%'
                })
            ], { optional: true }),
            query(':enter', [
                style({ left: '100%' })
            ], { optional: true }),
            query(':leave', animateChild(), { optional: true }),
            group([
                query(':leave', [
                    animate('.5s ease', style({ left: '-100%' }))
                ], { optional: true }),
                query(':enter', [
                    animate('.5s ease', style({ left: '0%' }))
                ], { optional: true })
            ]),
            query(':enter', animateChild(), { optional: true }),
        ]),
        transition('* => home', [
            query('.footer_bg', [style({ display: 'none' })], { optional: true }),
            query('.home_hd', [
                style({
                    position: 'relative',
                    top: '-202px'
                })
            ], { optional: true }),
            query('.mainLeft', [
                style({
                    position: 'relative',
                    left: '-100%'
                })
            ], { optional: true }),
            query('.mainRight', [
                style({
                    position: 'relative',
                    right: '-100%'
                })
            ], { optional: true }),
            // query(':enter', [
            //     style({
            //         position: 'fixed',
            //         top: '100%',
            //         left: 0,
            //         width: '100%'
            //     })
            // ], { optional: true }),
            group([
                query('.home_hd', [
                    animate('.8s .9s ease', style({ top: 0 }))
                ], { optional: true }),
                query('.mainLeft', [
                    animate('.8s .5s ease', style({ left: 0 }))
                ], { optional: true }),
                query('.mainRight', [
                    animate('.8s .5s ease', style({ right: 0 }))
                ], { optional: true }),
                // query(':enter', [
                //     animate('1.2s 1s ease', style({ top: '58px' }))
                // ], { optional: true })
            ]),
            query(':enter', animateChild(), { optional: true }),
        ]),
        transition('* => screener', [
            query('.footer_bg', [style({ display: 'none' })], { optional: true }),
            query('.nav_tabs', [
                style({
                    position: 'absolute',
                    left: '-100%'
                })
            ], { optional: true }),
            query('.mainLeft', [
                style({
                    position: 'absolute',
                    left: '-100%'
                })
            ], { optional: true }),
            query('.mainRight', [
                style({
                    position: 'absolute',
                    right: '-100%'
                })
            ], { optional: true }),
            group([
                query('.nav_tabs', [
                    animate('.8s .2s ease', style({ left: 0 }))
                ], { optional: true }),
                query('.mainLeft', [
                    animate('.8s .2s ease', style({ left: 0 }))
                ], { optional: true }),
                query('.mainRight', [
                    animate('.8s .2s ease', style({ right: 0 }))
                ], { optional: true })
            ]),
            query(':enter', animateChild(), { optional: true }),
        ]),
        transition('* => hq', [
            query('.footer_bg', [style({ display: 'none' })], { optional: true }),
            query('.industry_nav', [
                style({
                    position: 'relative',
                    left: '-100%'
                })
            ], { optional: true }),
            query('.stock_container', [
                style({
                    position: 'relative',
                    right: '-100%'
                })
            ], { optional: true }),
            group([
                query('.industry_nav', [
                    animate('.8s .2s ease', style({ left: 0 }))
                ], { optional: true }),
                query('.stock_container', [
                    animate('.8s .2s ease', style({ right: 0 }))
                ], { optional: true })
            ]),
            query(':enter', animateChild(), { optional: true }),
        ]),
        transition('* => *', [
            style({ position: 'relative' }),
            query('.footer_bg', [style({ display: 'none' })], { optional: true }),
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%'
                })
            ], { optional: true }),
            query(':enter', [
                style({ left: '-100%' })
            ], { optional: true }),
            query(':leave', animateChild(), { optional: true }),
            group([
                query(':leave', [
                    animate('.5s ease', style({ left: '100%' }))
                ], { optional: true }),
                query(':enter', [
                    animate('.5s ease', style({ left: '0%' }))
                ], { optional: true })
            ]),
            query(':enter', animateChild(), { optional: true }),
        ]),
    ]);