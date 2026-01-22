'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import NavBar from '@/components/navbar/NavBar';
import Footer from '@/components/footer/Footer';
import styles from './useCaseDetail.module.css';

// Use Case main icons mapping (same as main page but in blue)
const useCaseMainIcons = {
  'shopping-in-email': "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' data-name='Layer 1' viewBox='0 0 24 24'%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.75' d='M3.41 7.23h17.18v12.41a2.86 2.86 0 0 1-2.86 2.86H6.27a2.86 2.86 0 0 1-2.86-2.86z'/%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.75' d='M7.23 10.09V6.27A4.77 4.77 0 0 1 12 1.5a4.77 4.77 0 0 1 4.77 4.77v3.82'/%3e%3c/svg%3e",
  'in-email-reviews-and-feedback': "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M11.283 3.453c.23-.467.345-.7.502-.775a.5.5 0 0 1 .43 0c.157.075.272.308.502.775l2.187 4.43c.068.138.102.207.152.26a.5.5 0 0 0 .155.114c.067.03.143.042.295.064l4.891.715c.515.075.773.113.892.238a.5.5 0 0 1 .133.41c-.023.172-.21.353-.582.716l-3.54 3.446c-.11.108-.165.162-.2.226a.5.5 0 0 0-.06.183c-.009.072.004.148.03.3l.835 4.867c.088.514.132.77.05.922a.5.5 0 0 1-.349.253c-.17.032-.4-.09-.862-.332l-4.373-2.3c-.136-.07-.204-.107-.276-.12a.5.5 0 0 0-.192 0c-.072.013-.14.05-.276.12l-4.373 2.3c-.461.243-.692.364-.862.332a.5.5 0 0 1-.348-.253c-.083-.152-.039-.409.05-.922l.834-4.867c.026-.152.039-.228.03-.3a.5.5 0 0 0-.06-.184c-.035-.063-.09-.117-.2-.225L3.16 10.4c-.373-.363-.56-.544-.582-.716a.5.5 0 0 1 .132-.41c.12-.125.377-.163.892-.238l4.891-.715c.152-.022.228-.034.295-.064a.5.5 0 0 0 .155-.113c.05-.054.084-.123.152-.26l2.187-4.43Z'/%3e%3c/svg%3e",
  'product-recommendations': "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%234a5fd9' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m6 10.05L15.46 18H7v-7.56L12 5l1 1v.53L12.41 10H18z'/%3e%3c/svg%3e",
  'event-registration': "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M21 8H3m13-6v3M8 2v3m-.2 17h8.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C21 19.72 21 18.88 21 17.2V8.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C18.72 4 17.88 4 16.2 4H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 6.28 3 7.12 3 8.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C5.28 22 6.12 22 7.8 22m4.197-9.67c-.8-.908-2.133-1.153-3.135-.32-1.002.832-1.143 2.223-.356 3.208.571.715 2.153 2.122 2.977 2.839.179.155.268.233.373.264.09.027.192.027.283 0 .104-.03.194-.109.372-.264.824-.717 2.407-2.124 2.978-2.84a2.256 2.256 0 0 0-.356-3.208c-1.02-.823-2.336-.587-3.136.322Z'/%3e%3c/svg%3e",
  'surveys-and-polls': "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%234a5fd9' fill-rule='evenodd' d='M19 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3z' clip-rule='evenodd'/%3e%3cpath fill='%234a5fd9' d='M11 7h2v10h-2zm4 6h2v4h-2zm-8-3h2v7H7z'/%3e%3c/svg%3e",
  'subscription-management': "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%234a5fd9' d='M4 20h16v-8H4zm6-7.27L16 16l-6 3.26z' opacity='.3'/%3e%3cpath fill='%234a5fd9' d='M4 6h16v2H4zm2-4h12v2H6zm14 8H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2m0 10H4v-8h16zm-10-7.27v6.53L16 16z'/%3e%3c/svg%3e",
  'abandoned-cart-recovery': "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' data-name='Layer 1' viewBox='0 0 24 24'%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.5' d='m7.21 15.82 15.27-2.86v-8.6H4.15'/%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.5' d='M.52 1.5h2.87L7.2 15.82l-1.66 2.49a1.5 1.5 0 0 0-.24.82 1.46 1.46 0 0 0 1.46 1.46h11.9'/%3e%3ccircle cx='18.66' cy='21.55' r='.95' fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.5'/%3e%3ccircle cx='9.11' cy='21.55' r='.95' fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.5'/%3e%3c/svg%3e",
  'nps-and-customer-satisfaction': "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' viewBox='0 0 24 24'%3e%3cpath d='M4 8h1v8m4-6v4a2 2 0 1 0 4 0v-4a2 2 0 1 0-4 0m7 0v4a2 2 0 1 0 4 0v-4a2 2 0 1 0-4 0'/%3e%3c/svg%3e",
  'product-bundles-and-upsells': "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M21 9.5V7.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C18.72 3 17.88 3 16.2 3H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 5.28 3 6.12 3 7.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C5.28 21 6.12 21 7.8 21h1.7m7.886-3.289-1.698 3.154c-.278.516-.417.774-.586.84a.5.5 0 0 1-.447-.038c-.155-.096-.247-.374-.43-.93L11.5 12.511c-.16-.486-.241-.73-.183-.892a.5.5 0 0 1 .302-.302c.162-.058.405.022.892.183l8.226 2.724c.556.184.834.276.93.431a.5.5 0 0 1 .039.447c-.067.17-.325.308-.84.586l-3.155 1.698a1 1 0 0 0-.152.09.5.5 0 0 0-.082.083 1 1 0 0 0-.09.152Z'/%3e%3c/svg%3e"
};

// AMP Element icons mapping (in blue)
const ampElementIcons = {
  'carousel': "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' viewBox='0 0 24 24'%3e%3cpath d='M7 6a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1zm15 11h-1a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h1M2 17h1a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H2'/%3e%3c/svg%3e",
  'tinder-products': "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2m0 0v10m0 0 4-4m-4 4-4-4'/%3e%3c/svg%3e",
  'product-block': "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16'/%3e%3cpath stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m3.27 6.96 8.73 5.04 8.73-5.04M12 22.08V12'/%3e%3c/svg%3e",
  'product-grid': "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M10 3H3v7h7zM21 3h-7v7h7zM21 14h-7v7h7zM10 14H3v7h7z'/%3e%3c/svg%3e",
  'image-carousel': "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2'/%3e%3cpath stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M21 15l-5-5L5 21'/%3e%3c/svg%3e",
  'checkbox': "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%234a5fd9' viewBox='0 0 24 24'%3e%3cpath d='M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0m8-10C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2m5.457 7.457-1.414-1.414L11 13.086l-2.793-2.793-1.414 1.414L11 15.914z'/%3e%3c/svg%3e",
  'form': "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9 2 2 4-4'/%3e%3c/svg%3e",
  'feedback': "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M11.283 3.453c.23-.467.345-.7.502-.775a.5.5 0 0 1 .43 0c.157.075.272.308.502.775l2.187 4.43c.068.138.102.207.152.26a.5.5 0 0 0 .155.114c.067.03.143.042.295.064l4.891.715c.515.075.773.113.892.238a.5.5 0 0 1 .133.41c-.023.172-.21.353-.582.716l-3.54 3.446c-.11.108-.165.162-.2.226a.5.5 0 0 0-.06.183c-.009.072.004.148.03.3l.835 4.867c.088.514.132.77.05.922a.5.5 0 0 1-.349.253c-.17.032-.4-.09-.862-.332l-4.373-2.3c-.136-.07-.204-.107-.276-.12a.5.5 0 0 0-.192 0c-.072.013-.14.05-.276.12l-4.373 2.3c-.461.243-.692.364-.862.332a.5.5 0 0 1-.348-.253c-.083-.152-.039-.409.05-.922l.834-4.867c.026-.152.039-.228.03-.3a.5.5 0 0 0-.06-.184c-.035-.063-.09-.117-.2-.225L3.16 10.4c-.373-.363-.56-.544-.582-.716a.5.5 0 0 1 .132-.41c.12-.125.377-.163.892-.238l4.891-.715c.152-.022.228-.034.295-.064a.5.5 0 0 0 .155-.113c.05-.054.084-.123.152-.26l2.187-4.43Z'/%3e%3c/svg%3e",
  'review-collection': "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M11.283 3.453c.23-.467.345-.7.502-.775a.5.5 0 0 1 .43 0c.157.075.272.308.502.775l2.187 4.43c.068.138.102.207.152.26a.5.5 0 0 0 .155.114c.067.03.143.042.295.064l4.891.715c.515.075.773.113.892.238a.5.5 0 0 1 .133.41c-.023.172-.21.353-.582.716l-3.54 3.446c-.11.108-.165.162-.2.226a.5.5 0 0 0-.06.183c-.009.072.004.148.03.3l.835 4.867c.088.514.132.77.05.922a.5.5 0 0 1-.349.253c-.17.032-.4-.09-.862-.332l-4.373-2.3c-.136-.07-.204-.107-.276-.12a.5.5 0 0 0-.192 0c-.072.013-.14.05-.276.12l-4.373 2.3c-.461.243-.692.364-.862.332a.5.5 0 0 1-.348-.253c-.083-.152-.039-.409.05-.922l.834-4.867c.026-.152.039-.228.03-.3a.5.5 0 0 0-.06-.184c-.035-.063-.09-.117-.2-.225L3.16 10.4c-.373-.363-.56-.544-.582-.716a.5.5 0 0 1 .132-.41c.12-.125.377-.163.892-.238l4.891-.715c.152-.022.228-.034.295-.064a.5.5 0 0 0 .155-.113c.05-.054.084-.123.152-.26l2.187-4.43Z'/%3e%3c/svg%3e",
  'score': "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%234a5fd9' stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m4.635 14.415 1.039-2.203a.357.357 0 0 1 .652 0l1.04 2.203 2.323.356c.298.045.416.429.2.649l-1.68 1.713.396 2.421c.051.311-.26.548-.527.401L6 18.812l-2.078 1.143c-.267.147-.578-.09-.527-.4l.396-2.422-1.68-1.713c-.217-.22-.098-.604.2-.65zm12 0 1.039-2.203a.357.357 0 0 1 .652 0l1.04 2.203 2.323.356c.298.045.416.429.2.649l-1.68 1.713.396 2.421c.051.311-.26.548-.527.401L18 18.812l-2.078 1.143c-.267.147-.578-.09-.527-.4l.396-2.422-1.68-1.713c-.216-.22-.098-.604.2-.65zm-6-9 1.039-2.203a.357.357 0 0 1 .652 0l1.04 2.203 2.323.356c.298.045.416.429.2.649l-1.68 1.713.396 2.421c.051.311-.26.548-.527.401L12 9.812l-2.078 1.143c-.267.147-.578-.09-.527-.4l.396-2.422-1.68-1.713c-.217-.22-.098-.604.2-.65z'/%3e%3c/svg%3e",
  'quiz': "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%234a5fd9' d='M4 6H2v14c0 1.1.9 2 2 2h14v-2H4zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m0 14H8V4h12zm-6.49-5.84c.41-.73 1.18-1.16 1.63-1.8.48-.68.21-1.94-1.14-1.94-.88 0-1.32.67-1.5 1.23l-1.37-.57C11.51 5.96 12.52 5 13.99 5c1.23 0 2.08.56 2.51 1.26.37.6.58 1.73.01 2.57-.63.93-1.23 1.21-1.56 1.81-.13.24-.18.4-.18 1.18h-1.52c.01-.41-.06-1.08.26-1.66m-.56 3.79c0-.59.47-1.04 1.05-1.04.59 0 1.04.45 1.04 1.04 0 .58-.44 1.05-1.04 1.05-.58 0-1.05-.47-1.05-1.05'/%3e%3c/svg%3e",
  'accordion': "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' data-name='Layer 1' viewBox='0 0 24 24'%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.5' d='M.5 13h23M.5 7.25h23m-23 11.5h12.46'/%3e%3c/svg%3e",
  'action-button': "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M5 12h14m-7-7 7 7-7 7'/%3e%3c/svg%3e",
  'sms-capture': "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2M12 18h.01'/%3e%3c/svg%3e",
  'poll': "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%234a5fd9' fill-rule='evenodd' d='M19 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3z' clip-rule='evenodd'/%3e%3cpath fill='%234a5fd9' d='M11 7h2v10h-2zm4 6h2v4h-2zm-8-3h2v7H7z'/%3e%3c/svg%3e",
  'subscription-portal': "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%234a5fd9' d='M4 6h16v2H4zm2-4h12v2H6zm14 8H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2m0 10H4v-8h16zm-10-7.27v6.53L16 16z'/%3e%3c/svg%3e",
  'reactivate': "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M1 4v6h6M23 20v-6h-6'/%3e%3cpath stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15'/%3e%3c/svg%3e",
  'spin-wheel': "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' viewBox='0 0 24 24'%3e%3ccircle cx='12' cy='12' r='8'/%3e%3cpath d='M12 2v7.5M19 5l-5.23 5.23M22 12h-7.5m4.5 7-5.23-5.23M12 14.5V22m-1.77-8.23L5 19m4.5-7H2m8.23-1.77L5 5'/%3e%3ccircle cx='12' cy='12' r='2.5'/%3e%3c/svg%3e",
  'flip-to-reveal': "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5'/%3e%3c/svg%3e",
  'click-to-reveal': "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8'/%3e%3ccircle cx='12' cy='12' r='3' stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5'/%3e%3c/svg%3e"
};

const useCasesData = {
  'shopping-in-email': {
    title: 'Shopping in Email',
    icon: useCaseMainIcons['shopping-in-email'],
    description: 'Transform your email campaigns into interactive shopping experiences. Let customers browse products, add items to cart, and complete purchases directly within the email without leaving their inbox.',
    benefits: ['Increase conversion rates by 40%', 'Reduce cart abandonment significantly', 'Provide seamless shopping experience', 'Real-time inventory updates', 'One-click checkout process'],
    features: [
      { title: 'Product Carousel', description: 'Showcase multiple products with interactive carousels that customers can browse directly in email.' },
      { title: 'Add to Cart', description: 'Enable customers to add products to their cart without leaving the email.' },
      { title: 'Live Pricing', description: 'Display real-time pricing and availability information.' },
      { title: 'Quick Checkout', description: 'Streamlined checkout process with saved payment methods.' }
    ],
    ampElements: [
      { slug: 'carousel', icon: ampElementIcons['carousel'], title: 'Carousel' },
      { slug: 'tinder-products', icon: ampElementIcons['tinder-products'], title: 'Tinder Products' },
      { slug: 'product-block', icon: ampElementIcons['product-block'], title: 'Product Block' },
      { slug: 'product-grid', icon: ampElementIcons['product-grid'], title: 'Product Grid' },
      { slug: 'image-carousel', icon: ampElementIcons['image-carousel'], title: 'Image Carousel' },
      { slug: 'checkbox', icon: ampElementIcons['checkbox'], title: 'Checkbox' },
      { slug: 'form', icon: ampElementIcons['form'], title: 'Form' }
    ]
  },
  'in-email-reviews-and-feedback': {
    title: 'In-Email Reviews & Feedback',
    icon: useCaseMainIcons['in-email-reviews-and-feedback'],
    description: 'Collect valuable customer feedback and reviews without requiring users to visit external websites. Interactive forms embedded directly in your emails make it easy for customers to share their thoughts.',
    benefits: ['Boost social proof with authentic reviews', 'Achieve higher response rates', 'Enable real-time feedback collection', 'Improve customer satisfaction scores', 'Build trust with potential customers'],
    features: [
      { title: 'Star Ratings', description: 'Simple and intuitive star rating system directly in email.' },
      { title: 'Text Feedback', description: 'Collect detailed written feedback from customers.' },
      { title: 'Image Upload', description: 'Allow customers to share photos with their reviews.' },
      { title: 'Instant Submission', description: 'Reviews are submitted instantly without page redirects.' }
    ],
    ampElements: [
      { slug: 'feedback', icon: ampElementIcons['feedback'], title: 'Feedback' },
      { slug: 'review-collection', icon: ampElementIcons['review-collection'], title: 'Review Collection' },
      { slug: 'score', icon: ampElementIcons['score'], title: 'Score (1-5)' },
      { slug: 'form', icon: ampElementIcons['form'], title: 'Form' }
    ]
  },
  'product-recommendations': {
    title: 'Product Recommendations',
    icon: useCaseMainIcons['product-recommendations'],
    description: 'Deliver personalized product recommendations with interactive carousels that customers can browse and purchase from, all within their email inbox.',
    benefits: ['Increase average order value', 'Provide personalized experience', 'Create cross-sell opportunities', 'Boost customer engagement', 'Drive repeat purchases'],
    features: [
      { title: 'AI-Powered Recommendations', description: 'Smart product suggestions based on customer behavior and preferences.' },
      { title: 'Interactive Browsing', description: 'Customers can browse through recommendations without leaving email.' },
      { title: 'Quick Add to Cart', description: 'One-click add to cart functionality for recommended products.' },
      { title: 'Dynamic Content', description: 'Real-time product updates and personalization.' }
    ],
    ampElements: [
      { slug: 'carousel', icon: ampElementIcons['carousel'], title: 'Carousel' },
      { slug: 'tinder-products', icon: ampElementIcons['tinder-products'], title: 'Tinder Products' },
      { slug: 'product-block', icon: ampElementIcons['product-block'], title: 'Product Block' },
      { slug: 'product-grid', icon: ampElementIcons['product-grid'], title: 'Product Grid' },
      { slug: 'image-carousel', icon: ampElementIcons['image-carousel'], title: 'Image Carousel' },
      { slug: 'quiz', icon: ampElementIcons['quiz'], title: 'Quiz' }
    ]
  },
  'event-registration': {
    title: 'Event Registration',
    icon: useCaseMainIcons['event-registration'],
    description: 'Enable customers to register for events, webinars, or appointments directly from the email with interactive forms. Streamline the registration process and increase attendance rates.',
    benefits: ['Streamlined registration process', 'Higher attendance rates', 'Instant confirmation emails', 'Reduce registration friction', 'Automated calendar integration'],
    features: [
      { title: 'One-Click Registration', description: 'Simple registration process without leaving the email.' },
      { title: 'Calendar Integration', description: 'Automatically add events to attendee calendars.' },
      { title: 'Instant Confirmation', description: 'Immediate confirmation and event details.' },
      { title: 'Reminder System', description: 'Automated reminders before the event.' }
    ],
    ampElements: [
      { slug: 'form', icon: ampElementIcons['form'], title: 'Form' },
      { slug: 'checkbox', icon: ampElementIcons['checkbox'], title: 'Checkbox' },
      { slug: 'accordion', icon: ampElementIcons['accordion'], title: 'Accordion' },
      { slug: 'action-button', icon: ampElementIcons['action-button'], title: 'Action Button' },
      { slug: 'sms-capture', icon: ampElementIcons['sms-capture'], title: 'SMS Capture' }
    ]
  },
  'surveys-and-polls': {
    title: 'Surveys & Polls',
    icon: useCaseMainIcons['surveys-and-polls'],
    description: 'Engage your audience with interactive surveys and polls that they can complete without leaving their inbox. Gather valuable insights and feedback in real-time.',
    benefits: ['Higher completion rates', 'Real-time insights and analytics', 'Better customer engagement', 'Instant data collection', 'Improved decision making'],
    features: [
      { title: 'Multiple Question Types', description: 'Support for multiple choice, rating scales, and open-ended questions.' },
      { title: 'Real-Time Results', description: 'View survey results and analytics in real-time.' },
      { title: 'Conditional Logic', description: 'Show different questions based on previous answers.' },
      { title: 'Anonymous Responses', description: 'Option for anonymous feedback collection.' }
    ],
    ampElements: [
      { slug: 'poll', icon: ampElementIcons['poll'], title: 'Poll' },
      { slug: 'quiz', icon: ampElementIcons['quiz'], title: 'Quiz' },
      { slug: 'score', icon: ampElementIcons['score'], title: 'Score (1-5)' },
      { slug: 'checkbox', icon: ampElementIcons['checkbox'], title: 'Checkbox' },
      { slug: 'action-button', icon: ampElementIcons['action-button'], title: 'Action Button' }
    ]
  },
  'subscription-management': {
    title: 'Subscription Management',
    icon: useCaseMainIcons['subscription-management'],
    description: 'Allow subscribers to manage their preferences, update subscriptions, or upgrade plans directly in the email. Reduce churn and improve user experience.',
    benefits: ['Reduce customer churn', 'Easy preference management', 'Improved user experience', 'Self-service options', 'Increase upgrade conversions'],
    features: [
      { title: 'Preference Center', description: 'Let users manage email preferences without logging in.' },
      { title: 'Plan Upgrades', description: 'Enable easy plan upgrades directly from email.' },
      { title: 'Frequency Control', description: 'Allow users to control email frequency.' },
      { title: 'Topic Selection', description: 'Let subscribers choose content topics they want to receive.' }
    ],
    ampElements: [
      { slug: 'subscription-portal', icon: ampElementIcons['subscription-portal'], title: 'Subscription Portal' },
      { slug: 'reactivate', icon: ampElementIcons['reactivate'], title: 'Reactivate' },
      { slug: 'checkbox', icon: ampElementIcons['checkbox'], title: 'Checkbox' },
      { slug: 'form', icon: ampElementIcons['form'], title: 'Form' },
      { slug: 'accordion', icon: ampElementIcons['accordion'], title: 'Accordion' },
      { slug: 'action-button', icon: ampElementIcons['action-button'], title: 'Action Button' }
    ]
  },
  'abandoned-cart-recovery': {
    title: 'Abandoned Cart Recovery',
    icon: useCaseMainIcons['abandoned-cart-recovery'],
    description: 'Send interactive emails with the abandoned cart items, allowing customers to complete their purchase instantly. Recover lost sales with personalized reminders.',
    benefits: ['Recover lost sales effectively', 'One-click checkout process', 'Personalized product reminders', 'Increase conversion rates', 'Reduce cart abandonment'],
    features: [
      { title: 'Cart Preview', description: 'Show abandoned items with images and prices in email.' },
      { title: 'Quick Checkout', description: 'Complete purchase without returning to website.' },
      { title: 'Dynamic Pricing', description: 'Display current prices and availability.' },
      { title: 'Incentive Offers', description: 'Include special discounts to encourage completion.' }
    ],
    ampElements: [
      { slug: 'carousel', icon: ampElementIcons['carousel'], title: 'Carousel' },
      { slug: 'product-block', icon: ampElementIcons['product-block'], title: 'Product Block' },
      { slug: 'image-carousel', icon: ampElementIcons['image-carousel'], title: 'Image Carousel' },
      { slug: 'spin-wheel', icon: ampElementIcons['spin-wheel'], title: 'Spin Wheel' },
      { slug: 'flip-to-reveal', icon: ampElementIcons['flip-to-reveal'], title: 'Flip To Reveal' },
      { slug: 'click-to-reveal', icon: ampElementIcons['click-to-reveal'], title: 'Click To Reveal' },
      { slug: 'form', icon: ampElementIcons['form'], title: 'Form' }
    ]
  },
  'nps-and-customer-satisfaction': {
    title: 'NPS & Customer Satisfaction',
    icon: useCaseMainIcons['nps-and-customer-satisfaction'],
    description: 'Measure customer satisfaction with interactive NPS surveys and satisfaction ratings embedded in emails. Track customer sentiment and identify promoters.',
    benefits: ['Track customer sentiment accurately', 'Identify brand promoters', 'Improve customer retention', 'Actionable feedback insights', 'Benchmark satisfaction scores'],
    features: [
      { title: 'NPS Scoring', description: 'Standard Net Promoter Score measurement in email.' },
      { title: 'Follow-up Questions', description: 'Conditional questions based on NPS score.' },
      { title: 'Sentiment Analysis', description: 'Analyze customer feedback automatically.' },
      { title: 'Trend Tracking', description: 'Monitor satisfaction trends over time.' }
    ],
    ampElements: [
      { slug: 'score', icon: ampElementIcons['score'], title: 'Score (1-5)' },
      { slug: 'feedback', icon: ampElementIcons['feedback'], title: 'Feedback' },
      { slug: 'review-collection', icon: ampElementIcons['review-collection'], title: 'Review Collection' },
      { slug: 'poll', icon: ampElementIcons['poll'], title: 'Poll' }
    ]
  },
  'product-bundles-and-upsells': {
    title: 'Product Bundles & Upsells',
    icon: useCaseMainIcons['product-bundles-and-upsells'],
    description: 'Showcase product bundles and upsell opportunities with interactive elements that drive additional purchases. Increase revenue per customer with smart recommendations.',
    benefits: ['Increase revenue per customer', 'Smart product recommendations', 'Easy bundle selection', 'Cross-sell opportunities', 'Higher average order value'],
    features: [
      { title: 'Bundle Builder', description: 'Let customers create custom product bundles in email.' },
      { title: 'Upsell Suggestions', description: 'Show relevant upsell products based on purchase history.' },
      { title: 'Discount Display', description: 'Highlight bundle savings and special offers.' },
      { title: 'Quick Add', description: 'Add entire bundles to cart with one click.' }
    ],
    ampElements: [
      { slug: 'checkbox', icon: ampElementIcons['checkbox'], title: 'Checkbox' },
      { slug: 'carousel', icon: ampElementIcons['carousel'], title: 'Carousel' },
      { slug: 'product-grid', icon: ampElementIcons['product-grid'], title: 'Product Grid' },
      { slug: 'product-block', icon: ampElementIcons['product-block'], title: 'Product Block' },
      { slug: 'tinder-products', icon: ampElementIcons['tinder-products'], title: 'Tinder Products' }
    ]
  }
};

export default function UseCaseDetail() {
  const params = useParams();
  const slug = params.slug;
  const useCase = useCasesData[slug];

  if (!useCase) {
    return (
      <>
        <NavBar />
        <div className="container">
          <div className={styles.wrapper}>
            <h1>Use Case Not Found</h1>
            <p>The use case you're looking for doesn't exist.</p>
            <a href="/use-cases">Back to Use Cases</a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className={styles.navbarWrapper}>
        <div className="container-fluid">
          <div className="container">
            <NavBar />
          </div>
        </div>
      </div>
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <div className={styles.icon}>
              <img src={useCase.icon} alt={useCase.title} />
            </div>
            <h1 className={styles.title}>{useCase.title}</h1>
            <p className={styles.description}>{useCase.description}</p>
          </div>

          <div className={styles.benefitsFeaturesContainer}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Key Benefits</h2>
              <ul className={styles.benefitsList}>
                {useCase.benefits.map((benefit, idx) => (
                  <li key={idx} className={styles.benefit}>
                    <span className={styles.checkmark}>
                      <svg width="12" height="11" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.00378 0.445204L3.80248 6.06595L1.9908 3.694C1.80952 3.45846 1.54314 3.30542 1.25029 3.26852C0.957432 3.23163 0.66208 3.31391 0.429207 3.49727C0.196333 3.68063 0.0450134 3.95004 0.00853663 4.24624C-0.0279401 4.54244 0.0534138 4.84117 0.234701 5.0767L2.93554 8.57281C3.04021 8.70678 3.17368 8.81488 3.32582 8.8889C3.47796 8.96291 3.64477 9.0009 3.81359 8.99998C3.98333 8.99957 4.15072 8.95984 4.30293 8.88385C4.45513 8.80785 4.5881 8.6976 4.69164 8.56156L9.771 1.81667C9.95082 1.57815 10.0296 1.27716 9.98998 0.979906C9.95038 0.682651 9.79564 0.413482 9.55982 0.231615C9.324 0.0497478 9.02641 -0.0299211 8.73251 0.0101345C8.43861 0.0501901 8.17248 0.20669 7.99267 0.445204H8.00378Z" fill="#ED5370"/>
                      </svg>
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Features</h2>
              <div className={styles.featuresGrid}>
                {useCase.features.map((feature, idx) => (
                  <div key={idx} className={styles.featureCard}>
                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                    <p className={styles.featureDescription}>{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {useCase.ampElements && useCase.ampElements.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Recommended AMP Elements</h2>
              <p className={styles.ampSubtitle}>Interactive elements perfect for this use case</p>
              <div className={styles.ampElementsGrid}>
                {useCase.ampElements.map((element, idx) => (
                  <a key={idx} href={`/amp-elements/${element.slug}`} className={styles.ampElementCard}>
                    <div className={styles.ampElementIcon}>
                      <img src={element.icon} alt={element.title} />
                    </div>
                    <h3 className={styles.ampElementTitle}>{element.title}</h3>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className={styles.ctaSection}>
            <h2 className={styles.ctaTitle}>Ready to Get Started?</h2>
            <p className={styles.ctaText}>
              Start using {useCase.title} today and transform your email marketing campaigns.
            </p>
            <div className={styles.ctaButtons}>
              <a href="https://app.convertic.ai/users/register" className={styles.primaryButton}>
                Get Started Free
              </a>
              <a href="/pricing" className={styles.secondaryButton}>
                View Pricing
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
