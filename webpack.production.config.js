const pathM = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
/* const { CleanWebpackPlugin } = require('clean-webpack-plugin');
 */
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
   entry: './src/js/index.js',
   output: {
      filename: 'js/bundle.[contenthash].js',
      path: pathM.resolve(__dirname, './dist'),
      assetModuleFilename: '[path][name].[contenthash][ext]', 
      publicPath: './',
      clean: true /* {
         dry: false,
         keep:/\.css$/ 
      } */   //Serve per cancellare la cartella dist dalla precedente esecuzione
   },
   mode: 'production',
   module: {
      rules:[
         {
            test: /\.(png|jpe?g|webp|avif|gif|svg)$/,
            type: 'asset',
            parser: {
               dataUrlCondition: {
                  maxSize: 3 * 1024 //3 Kilobytes QUI CAMBIA LA SOGLIA A 3 KByte
                 /*  Il logo Angular è 6, 5 Kbyte.Cambia la soglia per includere
                  nel bundle js il logo */
               }
            }
         },
         /*rules per quando provi ad importare un file css da javascript. Uso due loaders
         css-loader  legge il contenuto del css e ritorna il contenuto
         style-loader prende il css e lo mette nella pagina, mette il css proprio nel
                      bundle.js Poi vedremo come generarli come file separati
         */
         {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader,'css-loader'] 
         },
         {
            test: /\.scss$/,
            use: [MiniCssExtractPlugin.loader,'css-loader','sass-loader'] 
         },
         {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
               loader: 'babel-loader',
               options: {
                  presets: [['@babel/env', {
                      targets: "> 0.1%, not dead",
                     debug:true, 
                     useBuiltIns: 'usage',
                     //Puoi mettere anche solo version:3
                     //La versione la puoi prelevare da package.json
                     corejs:{version:3.26 , proposals:true}
                  }]],
                  //plugins: ['@babel/plugin-proposal-class-properties']
               }
            }
         }
      ]
   },
   plugins: [
       new CopyWebpackPlugin({
         patterns: [
             { from: './assets/img', to: './assets/img/[name].[contenthash][ext]' },
            
          ],
          options: {
        concurrency: 100,
      }
      }),
      new MiniCssExtractPlugin({
      filename:"css/main.[contenthash].css"
      }),
      new HtmlWebpackPlugin({
        
         inject: false,
         template: "./index.ejs", //Puoi mettere anche un file html
         minify:true 
      })
      /*Nella seguente configurazione di questo plugin eliminiamo tutti i file
      e le cartelle e sottocartelle a partire dalla cartella .dist che è quella
      specificata in ouput.path
      asteriscoasterisco/asterisco  vuol dire tutti i file e le sottocartelle
      Inoltre specifico di ripulire anche tutti i file e le sottocartelle 
      dentro la cartella nomeCartella
      Nota che devo fornire un percorso assoluto perchè di default parte
      da ./dist (impostata in output.path)
      */
      //new CleanWebpackPlugin({
        // cleanOnceBeforeBuildPatterns: [
          //  '**/*',
           // path.join(process.cwd(),'nomeCartella/**/*')
      //]
   //})
   ]

}