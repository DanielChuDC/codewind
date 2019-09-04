/*******************************************************************************
 * Copyright (c) 2019 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v20.html
 *
 * Contributors:
 *     IBM Corporation - initial API and implementation
 *******************************************************************************/
/**
 * This file for different project specific (i.e liberty, spring, docker) capabaility configurations.
 */
import * as project from "../../../src/projects/Project";
import * as nodeProject from "../../../src/projects/nodejsProject";

// This config is to manual reset the running build queue and build status options for all project types.
// We currently need to do that because project that relies on script and IDC code does not follow the typescript code and need to be manually reset.
export const needManualReset: any = {
    "docker": {
        "buildStatus": false
    },
    "liberty": {
        "runningBuildQueue": true,
        "buildStatus": true
    },
    "nodejs": {
        "buildStatus": true
    },
    "spring": {
        "buildStatus": true
    },
};

// project specific capabaility settings: start modes and control commands
export const projectCapabilities: any = {
    "docker": {
        "local": project.defaultProjectCapabilities,
        "kube": project.defaultProjectCapabilities
    },
    "nodejs": {
        "local": {
            "startModes": ["run", "debugNoInit"],
            "controlCommands": ["restart"]
        },
        "kube": project.defaultProjectCapabilities
    },
    "spring": {
        "local": {
            "startModes": ["run", "debug", "debugNoInit"],
            "controlCommands": ["restart"]
        },
        "kube": project.defaultProjectCapabilities
    }
};

// auto build enable/disable event capabilities: some projects emit the project changed event and some don't do anything
export const autoBuildEventCapabailities: any = {
    "docker": false,
    "nodejs": true,
    "spring": false,
};

// list of start modes available in Turbine
export const startModes: Array<string> = ["run", "debug", "debugNoInit"];

// project specific restart capabilities depending on the above start modes
export const restartCapabilities: any = {
    "docker": {
        [startModes[0]]: false,
        [startModes[1]]: false,
        [startModes[2]]: false,
    },
    "nodejs": {
        [startModes[0]]: true,
        [startModes[1]]: false,
        [startModes[2]]: true,
    },
    "spring": {
        [startModes[0]]: true,
        [startModes[1]]: true,
        [startModes[2]]: true,
    },
};

// project specific debug capabilities
export const debugCapabilities: any = {
    "docker": false,
    "nodejs": true
};

// project specific maven profile capabilities
export const mavenProfileCapabilities: any = {
    "docker":  false,
    "nodejs": false
};

// list of mocked exposed debug ports
export const exposedDebugPorts = ["1000"];

// default context roots for projects
export const defaultContextRoot: any = {
    "lagom": "/api/hello/you"
};

// default health check endpoints for projects
export const defaultHealthCheckEndPoint: any = {
    "go": "/",
    "lagom": "/",
    "python": "/",
    "nodejs": "/"
};

// project specific setting for projects that only expose one app port
export const oneExposedPortOnly: any = {
    "go": {
        "local": true,
        "kube": true
    },
    "lagom": {
        "local": false,
        "kube": true
    },
    "python": {
        "local": true,
        "kube": true
    },
    "nodejs": {
        "local": false,
        "kube": true
    }
};

// project specific setting for default app ports
export const defaultInternalPorts: any = {
    "go": "8000",
    "lagom": "9000",
    "python": "5000",
    "nodejs": nodeProject.getDefaultAppPort()
};

// project specific settings to mark the main files
export const filesToUpdate: any = {
    "go": ["Dockerfile", "main.go"],
    "lagom": ["Dockerfile",
        "hello-api/src/main/java/com/example/rp/test/lagomendpoints/api/HelloService.java",
        "hello-impl/src/main/java/com/example/rp/test/lagomendpoints/impl/HelloModule.java",
        "hello-impl/src/main/java/com/example/rp/test/lagomendpoints/impl/HelloServiceImpl.java"],
    "python": ["Dockerfile", "app.py"],
    "nodejs": ["Dockerfile", "server/server.js"],
    "spring": ["Dockerfile", "src/main/java/application/rest/v1/Example.java"]
};
