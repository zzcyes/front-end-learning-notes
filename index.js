const fs = require('fs');

/**
 *
 * COMMON
 *
 */

const readDirSync = (path) => {
    const paths = fs.readdirSync(path);
    const catalogue = [];
    paths.forEach((name) => {
        if (name.includes('.')) return;
        catalogue.push(name);
    });
    return catalogue;
};

const writeTextToFile = (filePath, fileText = "") => {
    fs.writeFile(filePath, fileText, (err) => {
        if (err) {
            return console.error(err);
        }
        fs.readFile(filePath, (error, data) => {
            if (error) {
                return console.error(error);
            }
            // console.log('读取文件内容成功,内容如下:\n', data.toString());
        });
    });
};

/**
 *
 * CUSTOM
 *
 */

const config = {
    basePath: 'markdown'
};

const secondary = readDirSync(`${config.basePath}/`);

const readAllFiles = () => {
    const third = secondary.map((secondaryName) => {
        const subPaths = fs.readdirSync(`${config.basePath}/${secondaryName}`);
        const pathConfig = subPaths.map(path => {
            const index = path.lastIndexOf(".");
            return {
                name: path.slice(0, index) || "",
                type: path.slice(index + 1) || "",
                path,
                series: secondaryName,
                basePath: `${config.basePath}/${secondaryName}`,
                fullPath: `${config.basePath}/${secondaryName}/${path}`
            }
        });
        return pathConfig;
    });
    return third;
};

const createTemplate = () => {
    const allFiles = readAllFiles();
    let writeTemplate = "# front-end-learning-notes \n\n";
    let thirdTemplate = {};
    allFiles.forEach(thidItem => {
        const content = thidItem.map(item => {
            return `- ### [${item.name}](./${item.fullPath})`;
        });
        const [series] = thidItem;
        thirdTemplate[series.series] = content.join("\n\n");
    });
    Object.keys(thirdTemplate).forEach(key => {
        if (key === 'images') {
            return;
        }
        writeTemplate += `## ${key} \n\n`;
        writeTemplate += `${thirdTemplate[key]}\n\n`
    });
    return writeTemplate;
};

writeTextToFile('README.md', createTemplate());

